const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
  // Session Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionType: {
    type: String,
    enum: ['attention', 'memory', 'executive', 'processing', 'visual-spatial', 'mixed'],
    required: true
  },
  sessionName: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  
  // Session Details
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in minutes
    default: 0
  },
  
  // Performance Metrics
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  reactionTime: {
    average: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 }
  },
  completionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  
  // EEG Data
  eegData: {
    isRecorded: {
      type: Boolean,
      default: false
    },
    startTime: Date,
    endTime: Date,
    channels: [{
      name: String,
      data: [Number], // Raw EEG values
      samplingRate: { type: Number, default: 250 } // Hz
    }],
    processedData: {
      alpha: [Number], // Alpha wave power
      beta: [Number],  // Beta wave power
      theta: [Number], // Theta wave power
      delta: [Number], // Delta wave power
      gamma: [Number]  // Gamma wave power
    },
    artifacts: [{
      type: String, // 'blink', 'movement', 'noise'
      startTime: Number,
      endTime: Number,
      severity: String // 'low', 'medium', 'high'
    }]
  },
  
  // Training Exercises
  exercises: [{
    exerciseId: {
      type: String,
      required: true
    },
    exerciseType: {
      type: String,
      enum: ['attention-task', 'memory-game', 'puzzle', 'pattern-matching', 'reaction-time'],
      required: true
    },
    name: String,
    description: String,
    startTime: Date,
    endTime: Date,
    duration: Number, // in seconds
    score: Number,
    accuracy: Number,
    attempts: Number,
    correctAnswers: Number,
    totalQuestions: Number,
    difficulty: String,
    userResponses: [{
      questionId: String,
      userAnswer: mongoose.Schema.Types.Mixed,
      correctAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      reactionTime: Number,
      timestamp: Date
    }]
  }],
  
  // Session Status
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'paused', 'abandoned'],
    default: 'in-progress'
  },
  
  // Feedback and Notes
  userFeedback: {
    enjoyment: { type: Number, min: 1, max: 5 },
    difficulty: { type: Number, min: 1, max: 5 },
    comments: String
  },
  clinicianNotes: {
    type: String,
    maxlength: 1000
  },
  
  // Technical Information
  deviceInfo: {
    platform: String, // 'web', 'android', 'ios'
    browser: String,
    screenResolution: String,
    userAgent: String
  },
  
  // Session Metadata
  tags: [String],
  isPractice: {
    type: Boolean,
    default: false
  },
  parentSupervised: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
trainingSessionSchema.index({ userId: 1, startTime: -1 });
trainingSessionSchema.index({ sessionType: 1 });
trainingSessionSchema.index({ status: 1 });
trainingSessionSchema.index({ 'eegData.isRecorded': 1 });

// Pre-save middleware to calculate duration
trainingSessionSchema.pre('save', function(next) {
  if (this.startTime && this.endTime) {
    this.duration = Math.round((this.endTime - this.startTime) / (1000 * 60)); // Convert to minutes
  }
  next();
});

// Method to calculate session statistics
trainingSessionSchema.methods.getSessionStats = function() {
  const stats = {
    duration: this.duration,
    score: this.score,
    accuracy: this.accuracy,
    completionRate: this.completionRate,
    exerciseCount: this.exercises.length,
    averageReactionTime: this.reactionTime.average
  };
  
  // Calculate exercise-specific stats
  if (this.exercises.length > 0) {
    const totalAttempts = this.exercises.reduce((sum, ex) => sum + (ex.attempts || 0), 0);
    const totalCorrect = this.exercises.reduce((sum, ex) => sum + (ex.correctAnswers || 0), 0);
    const totalQuestions = this.exercises.reduce((sum, ex) => sum + (ex.totalQuestions || 0), 0);
    
    stats.totalAttempts = totalAttempts;
    stats.totalCorrect = totalCorrect;
    stats.totalQuestions = totalQuestions;
    stats.overallAccuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  }
  
  return stats;
};

// Method to add EEG data
trainingSessionSchema.methods.addEEGData = function(channelData, timestamp) {
  if (!this.eegData.isRecorded) {
    this.eegData.isRecorded = true;
    this.eegData.startTime = timestamp;
  }
  
  this.eegData.endTime = timestamp;
  
  // Add channel data
  channelData.forEach(channel => {
    const existingChannel = this.eegData.channels.find(c => c.name === channel.name);
    if (existingChannel) {
      existingChannel.data.push(...channel.data);
    } else {
      this.eegData.channels.push({
        name: channel.name,
        data: channel.data,
        samplingRate: channel.samplingRate || 250
      });
    }
  });
  
  return this.save();
};

// Method to process EEG data
trainingSessionSchema.methods.processEEGData = function() {
  if (!this.eegData.isRecorded || this.eegData.channels.length === 0) {
    return null;
  }
  
  // Simple EEG processing (in a real implementation, this would use more sophisticated algorithms)
  const processedData = {
    alpha: [],
    beta: [],
    theta: [],
    delta: [],
    gamma: []
  };
  
  // Process each channel
  this.eegData.channels.forEach(channel => {
    // Calculate power in different frequency bands
    // This is a simplified calculation - real implementation would use FFT
    const dataLength = channel.data.length;
    const alphaPower = channel.data.slice(0, Math.floor(dataLength * 0.2)).reduce((sum, val) => sum + Math.abs(val), 0);
    const betaPower = channel.data.slice(Math.floor(dataLength * 0.2), Math.floor(dataLength * 0.4)).reduce((sum, val) => sum + Math.abs(val), 0);
    const thetaPower = channel.data.slice(Math.floor(dataLength * 0.4), Math.floor(dataLength * 0.6)).reduce((sum, val) => sum + Math.abs(val), 0);
    const deltaPower = channel.data.slice(Math.floor(dataLength * 0.6), Math.floor(dataLength * 0.8)).reduce((sum, val) => sum + Math.abs(val), 0);
    const gammaPower = channel.data.slice(Math.floor(dataLength * 0.8)).reduce((sum, val) => sum + Math.abs(val), 0);
    
    processedData.alpha.push(alphaPower);
    processedData.beta.push(betaPower);
    processedData.theta.push(thetaPower);
    processedData.delta.push(deltaPower);
    processedData.gamma.push(gammaPower);
  });
  
  this.eegData.processedData = processedData;
  return this.save();
};

// Method to add exercise
trainingSessionSchema.methods.addExercise = function(exerciseData) {
  this.exercises.push({
    ...exerciseData,
    startTime: new Date()
  });
  return this.save();
};

// Method to complete exercise
trainingSessionSchema.methods.completeExercise = function(exerciseId, results) {
  const exercise = this.exercises.find(ex => ex.exerciseId === exerciseId);
  if (exercise) {
    exercise.endTime = new Date();
    exercise.duration = Math.round((exercise.endTime - exercise.startTime) / 1000);
    Object.assign(exercise, results);
  }
  return this.save();
};

// Static method to get user's training history
trainingSessionSchema.statics.getUserHistory = function(userId, limit = 10) {
  return this.find({ userId })
    .sort({ startTime: -1 })
    .limit(limit)
    .populate('userId', 'firstName lastName userType');
};

// Static method to get session analytics
trainingSessionSchema.statics.getAnalytics = function(userId, startDate, endDate) {
  const query = { userId };
  if (startDate && endDate) {
    query.startTime = { $gte: startDate, $lte: endDate };
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: '$sessionType',
        totalSessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        averageAccuracy: { $avg: '$accuracy' },
        totalDuration: { $sum: '$duration' },
        averageReactionTime: { $avg: '$reactionTime.average' }
      }
    }
  ]);
};

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);