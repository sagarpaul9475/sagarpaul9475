const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/training', require('./routes/training'));
app.use('/api/eeg', require('./routes/eeg'));
app.use('/api/progress', require('./routes/progress'));
app.use('/api/clinicians', require('./routes/clinicians'));

// Socket.IO for real-time EEG data
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Handle EEG data streaming
  socket.on('eeg-data', (data) => {
    // Process and store EEG data
    console.log('Received EEG data:', data);
    // Broadcast to clinician dashboard
    socket.broadcast.emit('eeg-update', data);
  });

  // Handle training session updates
  socket.on('training-update', (data) => {
    console.log('Training session update:', data);
    socket.broadcast.emit('session-update', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Cognitive Retraining Program API'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Cognitive Retraining Program API`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, io };