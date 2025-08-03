import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
    
    const socketInstance = io(backendUrl, {
      withCredentials: true,
      transports: ['websocket'], // Use only websocket initially
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true
    });

    // Debugging events
    socketInstance.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketInstance.on('connect_error', (err) => {
      console.error('Connection error:', err);
      // Fallback to polling if websocket fails
      socketInstance.io.opts.transports = ['polling', 'websocket'];
    });

    setSocket(socketInstance);

    return () => {
      if (socketInstance) socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};