import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

const Whiteboard = ({ whiteboardId, initialElements }) => {
  const socket = useSocket();
  const [elements, setElements] = useState(initialElements || []);
  const [isDrawing, setIsDrawing] = useState(false);
  const [users, setUsers] = useState({});
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', whiteboardId);

    socket.on('wb-update', (newElements) => {
      setElements(newElements);
      drawElements(newElements);
    });

    socket.on('user-cursor', ({ position, user, id }) => {
      setUsers(prev => ({
        ...prev,
        [id]: { position, user }
      }));
    });

    return () => {
      socket.off('wb-update');
      socket.off('user-cursor');
    };
  }, [socket, whiteboardId]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctxRef.current = ctx;
    drawElements(elements);
  }, []);

  const drawElements = (elementsToDraw) => {
    const ctx = ctxRef.current;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    elementsToDraw.forEach(element => {
      if (element.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(element.points[0].x, element.points[0].y);
      for (let i = 1; i < element.points.length; i++) {
        ctx.lineTo(element.points[i].x, element.points[i].y);
      }
      ctx.stroke();
    });
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = e.nativeEvent;
    setElements(prev => [
      ...prev, 
      { type: 'line', points: [{ x: offsetX, y: offsetY }] }
    ]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = e.nativeEvent;
    
    setElements(prev => {
      const newElements = [...prev];
      const lastElement = newElements[newElements.length - 1];
      lastElement.points.push({ x: offsetX, y: offsetY });
      return newElements;
    });

    drawElements(elements);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    socket.emit('wb-change', { roomId: whiteboardId, elements });
  };

  const handleCursorMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    socket.emit('cursor-position', { 
      roomId: whiteboardId, 
      position: { x: offsetX, y: offsetY },
      user: 'User' + Math.floor(Math.random() * 1000)
    });
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border rounded-lg bg-white w-full"
        onMouseDown={startDrawing}
        onMouseMove={(e) => {
          draw(e);
          handleCursorMove(e);
        }}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
      />
      
      {Object.entries(users).map(([id, { position, user }]) => (
        <div
          key={id}
          className="absolute bg-blue-500 text-white px-2 py-1 rounded-full text-xs flex items-center"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            transform: 'translateY(-100%)'
          }}
        >
          <div className="w-2 h-2 bg-blue-300 rounded-full mr-1"></div>
          {user}
        </div>
      ))}
    </div>
  );
};

export default Whiteboard;