

import React, { useEffect, useState, useRef } from 'react';
import { useSocket } from '../context/SocketContext';

const DocumentEditor = ({ documentId, initialContent }) => {
  const socket = useSocket();
  const [content, setContent] = useState(initialContent || { text: '' });
  const [users, setUsers] = useState({});
  const editorRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('join-room', documentId);

    socket.on('doc-update', (newContent) => {
      setContent(newContent);
    });

    socket.on('user-cursor', ({ position, user, id }) => {
      setUsers(prev => ({
        ...prev,
        [id]: { position, user }
      }));
    });

    return () => {
      socket.off('doc-update');
      socket.off('user-cursor');
    };
  }, [socket, documentId]);

  const handleChange = (e) => {
    const newContent = { ...content, text: e.target.value };
    setContent(newContent);
    socket.emit('doc-change', { roomId: documentId, content: newContent });
  };

  const handleCursorMove = (e) => {
    if (!editorRef.current) return;
    const rect = editorRef.current.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
    socket.emit('cursor-position', { 
      roomId: documentId, 
      position,
      user: 'User' + Math.floor(Math.random() * 1000) 
    });
  };

  return (
    <div className="relative h-full">
      <div 
        ref={editorRef}
        className="w-full h-full p-4 border rounded-lg bg-white"
        onMouseMove={handleCursorMove}
      >
        <textarea
          className="w-full h-full p-2 outline-none resize-none"
          value={content.text}
          onChange={handleChange}
          placeholder="Start collaborating..."
        />
      </div>
      
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

export default DocumentEditor;