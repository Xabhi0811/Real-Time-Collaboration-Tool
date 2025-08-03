require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Enhanced CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Additional CORS headers middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(express.json());

// Socket.IO with enhanced configuration
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
    transports: ['websocket', 'polling']
  },
  allowEIO3: true
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collab-tool', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Define schemas
const DocumentSchema = new mongoose.Schema({
  _id: String,
  title: String,
  content: Object,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const WhiteboardSchema = new mongoose.Schema({
  _id: String,
  title: String,
  elements: Array,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const Document = mongoose.model('Document', DocumentSchema);
const Whiteboard = mongoose.model('Whiteboard', WhiteboardSchema);

// Socket.io connection with enhanced error handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Error handling
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Document collaboration
  socket.on('doc-change', async ({ roomId, content }) => {
    try {
      socket.to(roomId).emit('doc-update', content);
      await Document.findByIdAndUpdate(roomId, { content, updatedAt: new Date() });
    } catch (error) {
      console.error('Document update error:', error);
    }
  });

  // Whiteboard collaboration
  socket.on('wb-change', async ({ roomId, elements }) => {
    try {
      socket.to(roomId).emit('wb-update', elements);
      await Whiteboard.findByIdAndUpdate(roomId, { elements, updatedAt: new Date() });
    } catch (error) {
      console.error('Whiteboard update error:', error);
    }
  });

  // Cursor position sharing
  socket.on('cursor-position', ({ roomId, position, user }) => {
    socket.to(roomId).emit('user-cursor', { position, user, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Routes with improved error handling
app.get('/api/documents', async (req, res) => {
  try {
    const documents = await Document.find();
    res.json(documents);
  } catch (err) {
    console.error('Error fetching documents:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/documents', async (req, res) => {
  try {
    const { title } = req.body;
    const document = new Document({
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      content: { text: '' }
    });
    await document.save();
    res.json(document);
  } catch (err) {
    console.error('Error creating document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    res.json(document);
  } catch (err) {
    console.error('Error fetching document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/whiteboards', async (req, res) => {
  try {
    const whiteboards = await Whiteboard.find();
    res.json(whiteboards);
  } catch (err) {
    console.error('Error fetching whiteboards:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/whiteboards', async (req, res) => {
  try {
    const { title } = req.body;
    const whiteboard = new Whiteboard({
      _id: new mongoose.Types.ObjectId().toString(),
      title,
      elements: []
    });
    await whiteboard.save();
    res.json(whiteboard);
  } catch (err) {
    console.error('Error creating whiteboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/whiteboards/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ error: 'Whiteboard not found' });
    }
    res.json(whiteboard);
  } catch (err) {
    console.error('Error fetching whiteboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});



// Delete Document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Notify all clients in the room
    io.to(req.params.id).emit('doc-deleted', { id: req.params.id });
    
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(req.params.id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Notify all clients in the room
    io.to(req.params.id).emit('doc-deleted', { id: req.params.id });
    
    res.json({ message: 'Document deleted successfully' });
  } catch (err) {
    console.error('Error deleting document:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Whiteboard
app.delete('/api/whiteboards/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findByIdAndDelete(req.params.id);
    if (!whiteboard) {
      return res.status(404).json({ error: 'Whiteboard not found' });
    }
    
    // Notify all clients in the room
    io.to(req.params.id).emit('wb-deleted', { id: req.params.id });
    
    res.json({ message: 'Whiteboard deleted successfully' });
  } catch (err) {
    console.error('Error deleting whiteboard:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS configured for: ${process.env.FRONTEND_URL || "http://localhost:5173"}`);
  console.log(`MongoDB connected to: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/collab-tool'}`);
});