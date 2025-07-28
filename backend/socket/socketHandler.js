const jwt = require('jsonwebtoken');
const User = require('../models/User');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user || !user.isActive) {
        return next(new Error('Authentication error'));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User ${socket.user.fullName} connected`);

    // Join user-specific room
    socket.join(`user_${socket.user._id}`);

    // Join role-specific room
    socket.join(`role_${socket.user.role}`);

    // Handle EEG data streaming
    socket.on('eeg_data_stream', (data) => {
      // Broadcast to clinicians monitoring this child
      if (socket.user.role === 'child') {
        socket.broadcast.to(`clinician_${socket.user.assignedClinician}`).emit('eeg_data_update', {
          childId: socket.user._id,
          data
        });
      }
    });

    // Handle training session updates
    socket.on('training_update', (sessionData) => {
      // Broadcast to parent and clinician
      if (socket.user.role === 'child') {
        socket.broadcast.to(`user_${socket.user.parentId}`).emit('child_training_update', sessionData);
        socket.broadcast.to(`user_${socket.user.assignedClinician}`).emit('patient_training_update', sessionData);
      }
    });

    // Handle real-time notifications
    socket.on('send_notification', (notification) => {
      if (socket.user.role === 'clinician') {
        socket.broadcast.to(`user_${notification.recipientId}`).emit('notification', {
          from: socket.user.fullName,
          message: notification.message,
          timestamp: new Date()
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${socket.user.fullName} disconnected`);
    });
  });
};

module.exports = socketHandler;
