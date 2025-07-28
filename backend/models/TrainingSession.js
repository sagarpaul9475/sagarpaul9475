const mongoose = require('mongoose');

const trainingSessionSchema = new mongoose.Schema({
  // Session Identification
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  
  // User Information
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Session Details
  trainingModule: {
    type: String,
    required: true,
    enum: [
      'attention_training',
      'memory_enhancement',
      'problem_solving',
      'executive_function',
      'processing_speed',
      'visual_perception',
      'auditory_processing',
      'language_skills'
    ]
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    planned: { type: Number, required: true }, // in minutes
    actual: { type: Number, default: 0 }
  },
  
  // Session Status
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled', 'paused'],
    default: 'scheduled'
  },
  
  // Performance Metrics
  performance: {
    accuracy: { type: Number, min: 0, max: 100 },
    reactionTime: { type: Number }, // in milliseconds
    completionRate: { type: Number, min: 0, max: 100 },
    errorsCount: { type: Number, default: 0 },
    hintsUsed: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  
  // Cognitive Metrics
  cognitiveMetrics: {
    attention: {
      sustained: { type: Number, min: 0, max: 100 },
      selective: { type: Number, min: 0, max: 100 },
      divided: { type: Number, min: 0, max: 100 }
    },
    memory: {
      workingMemory: { type: Number, min: 0, max: 100 },
      shortTerm: { type: Number, min: 0, max: 100 },
      longTerm: { type: Number, min: 0, max: 100 }
    },
    executiveFunction: {
      planning: { type: Number, min: 0, max: 100 },
      flexibility: { type: Number, min: 0, max: 100 },
      inhibition: { type: Number, min: 0, max: 100 }
    },
    processing: {
      speed: { type: Number, min: 0, max: 100 },
      accuracy: { type: Number, min: 0, max: 100 }
    }
  },
  
  // EEG Data Integration
  eegData: {
    hasEegData: { type: Boolean, default: false },
    eegSessionId: { type: String },
    brainwaveMetrics: {
      alpha: { type: Number },
      beta: { type: Number },
      theta: { type: Number },
      delta: { type: Number },
      gamma: { type: Number }
    },
    focusIndex: { type: Number, min: 0, max: 100 },
    relaxationIndex: { type: Number, min: 0, max: 100 },
    mentalWorkload: { type: Number, min: 0, max: 100 }
  },
  
  // Training Activities
  activities: [{
    activityName: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    attempts: { type: Number, default: 1 },
    success: { type: Boolean, default: false },
    timeSpent: { type: Number }, // in seconds
    responses: [{
      question: String,
      userAnswer: mongoose.Schema.Types.Mixed,
      correctAnswer: mongoose.Schema.Types.Mixed,
      isCorrect: Boolean,
      responseTime: Number,
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  
  // Session Environment
  environment: {
    location: { type: String, default: 'home' },
    deviceType: { type: String, enum: ['desktop', 'tablet', 'mobile'] },
    browserInfo: String,
    internetSpeed: String,
    distractions: [{
      type: String,
      timestamp: Date,
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    }]
  },
  
  // Feedback and Notes
  feedback: {
    childFeedback: {
      enjoyment: { type: Number, min: 1, max: 5 },
      difficulty: { type: Number, min: 1, max: 5 },
      comments: String
    },
    parentFeedback: {
      observation: String,
      behaviorNotes: String,
      concernsRaised: [String]
    },
    clinicianNotes: {
      observations: String,
      recommendations: String,
      nextSteps: String,
      followUpRequired: { type: Boolean, default: false }
    }
  },
  
  // Adaptive Learning
  adaptiveSettings: {
    difficultyAdjustment: { type: Number, default: 0 },
    speedAdjustment: { type: Number, default: 0 },
    supportLevel: { type: String, enum: ['minimal', 'moderate', 'high'] },
    customizations: [{
      parameter: String,
      value: mongoose.Schema.Types.Mixed,
      reason: String
    }]
  },
  
  // Timestamps
  scheduledTime: { type: Date, required: true },
  startTime: { type: Date },
  endTime: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for efficient querying
trainingSessionSchema.index({ childId: 1, createdAt: -1 });
trainingSessionSchema.index({ clinicianId: 1, scheduledTime: -1 });
trainingSessionSchema.index({ status: 1 });
trainingSessionSchema.index({ trainingModule: 1 });
trainingSessionSchema.index({ sessionId: 1 });

// Pre-save middleware to update timestamp
trainingSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for session duration calculation
trainingSessionSchema.virtual('actualDuration').get(function() {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime - this.startTime) / (1000 * 60)); // in minutes
  }
  return 0;
});

// Virtual for overall performance score
trainingSessionSchema.virtual('overallScore').get(function() {
  const { accuracy, completionRate, reactionTime } = this.performance;
  if (!accuracy || !completionRate) return 0;
  
  // Calculate weighted score
  const accuracyWeight = 0.4;
  const completionWeight = 0.3;
  const speedWeight = 0.3;
  
  const speedScore = reactionTime ? Math.max(0, 100 - (reactionTime / 100)) : 50;
  
  return Math.round(
    (accuracy * accuracyWeight) +
    (completionRate * completionWeight) +
    (speedScore * speedWeight)
  );
});

// Static method to get progress summary for a child
trainingSessionSchema.statics.getProgressSummary = async function(childId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        childId: mongoose.Types.ObjectId(childId),
        status: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$trainingModule',
        sessionsCount: { $sum: 1 },
        avgAccuracy: { $avg: '$performance.accuracy' },
        avgCompletionRate: { $avg: '$performance.completionRate' },
        avgReactionTime: { $avg: '$performance.reactionTime' },
        totalTimeSpent: { $sum: '$duration.actual' }
      }
    }
  ]);
};

// Static method to get recent sessions
trainingSessionSchema.statics.getRecentSessions = function(childId, limit = 10) {
  return this.find({ childId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('childId', 'firstName lastName')
    .populate('clinicianId', 'firstName lastName');
};

// Instance method to calculate improvement
trainingSessionSchema.methods.calculateImprovement = async function() {
  const previousSession = await this.constructor.findOne({
    childId: this.childId,
    trainingModule: this.trainingModule,
    status: 'completed',
    createdAt: { $lt: this.createdAt }
  }).sort({ createdAt: -1 });
  
  if (!previousSession) return null;
  
  return {
    accuracy: this.performance.accuracy - previousSession.performance.accuracy,
    reactionTime: previousSession.performance.reactionTime - this.performance.reactionTime,
    completionRate: this.performance.completionRate - previousSession.performance.completionRate
  };
};

// Ensure virtual fields are serialized
trainingSessionSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);