require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/collab-tool', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

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

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Document collaboration
  socket.on('doc-change', async ({ roomId, content }) => {
    socket.to(roomId).emit('doc-update', content);
    await Document.findByIdAndUpdate(roomId, { content, updatedAt: new Date() });
  });

  // Whiteboard collaboration
  socket.on('wb-change', async ({ roomId, elements }) => {
    socket.to(roomId).emit('wb-update', elements);
    await Whiteboard.findByIdAndUpdate(roomId, { elements, updatedAt: new Date() });
  });

  // Cursor position sharing
  socket.on('cursor-position', ({ roomId, position, user }) => {
    socket.to(roomId).emit('user-cursor', { position, user, id: socket.id });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// REST API Routes
app.get('/api/documents/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (err) {
    res.status(404).json({ error: 'Document not found' });
  }
});

app.post('/api/documents', async (req, res) => {
  const { title } = req.body;
  const document = new Document({
    _id: new mongoose.Types.ObjectId().toString(),
    title,
    content: { text: '' }
  });
  await document.save();
  res.json(document);
});

app.get('/api/whiteboards/:id', async (req, res) => {
  try {
    const whiteboard = await Whiteboard.findById(req.params.id);
    res.json(whiteboard);
  } catch (err) {
    res.status(404).json({ error: 'Whiteboard not found' });
  }
});

app.post('/api/whiteboards', async (req, res) => {
  const { title } = req.body;
  const whiteboard = new Whiteboard({
    _id: new mongoose.Types.ObjectId().toString(),
    title,
    elements: []
  });
  await whiteboard.save();
  res.json(whiteboard);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));