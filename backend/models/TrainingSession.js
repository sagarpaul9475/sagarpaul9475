const mongoose = require('mongoose');

const exerciseResultSchema = new mongoose.Schema({
  exerciseId: {
    type: String,
    required: true
  },
  exerciseType: {
    type: String,
    enum: ['attention', 'memory', 'executive-function', 'processing-speed'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in seconds
    required: true
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true
  },
  accuracy: {
    type: Number,
    min: 0,
    max: 100
  },
  reactionTime: {
    type: Number, // in milliseconds
    min: 0
  },
  attempts: {
    type: Number,
    default: 1
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  totalQuestions: {
    type: Number,
    default: 0
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  details: {
    type: mongoose.Schema.Types.Mixed // Store exercise-specific data
  }
});

const trainingSessionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clinician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sessionType: {
    type: String,
    enum: ['home-training', 'clinic-session', 'assessment', 'practice'],
    required: true
  },
  startTime: {
    type: Date,
    required: true,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  exercises: [exerciseResultSchema],
  summary: {
    totalExercises: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      min: 0,
      max: 100
    },
    averageAccuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    averageReactionTime: {
      type: Number
    },
    totalCorrectAnswers: {
      type: Number,
      default: 0
    },
    totalQuestions: {
      type: Number,
      default: 0
    },
    attentionScore: {
      type: Number,
      min: 0,
      max: 100
    },
    memoryScore: {
      type: Number,
      min: 0,
      max: 100
    },
    executiveFunctionScore: {
      type: Number,
      min: 0,
      max: 100
    },
    processingSpeedScore: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  settings: {
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    exerciseCount: {
      type: Number,
      default: 5
    },
    timeLimit: {
      type: Number, // in minutes
      default: 30
    },
    adaptiveDifficulty: {
      type: Boolean,
      default: true
    }
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  tags: [String],
  eegSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EEGSession'
  },
  mood: {
    before: {
      type: String,
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad']
    },
    after: {
      type: String,
      enum: ['very-happy', 'happy', 'neutral', 'sad', 'very-sad']
    }
  },
  feedback: {
    difficulty: {
      type: String,
      enum: ['too-easy', 'just-right', 'too-hard']
    },
    enjoyment: {
      type: Number,
      min: 1,
      max: 5
    },
    comments: String
  }
}, {
  timestamps: true
});

// Indexes for better query performance
trainingSessionSchema.index({ patient: 1, startTime: -1 });
trainingSessionSchema.index({ clinician: 1, startTime: -1 });
trainingSessionSchema.index({ sessionType: 1, status: 1 });

// Pre-save middleware to calculate duration
trainingSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Method to calculate session summary
trainingSessionSchema.methods.calculateSummary = function() {
  if (!this.exercises || this.exercises.length === 0) {
    return;
  }

  const exercises = this.exercises;
  const count = exercises.length;

  this.summary = {
    totalExercises: count,
    averageScore: exercises.reduce((sum, ex) => sum + ex.score, 0) / count,
    averageAccuracy: exercises.reduce((sum, ex) => sum + (ex.accuracy || 0), 0) / count,
    totalCorrectAnswers: exercises.reduce((sum, ex) => sum + ex.correctAnswers, 0),
    totalQuestions: exercises.reduce((sum, ex) => sum + ex.totalQuestions, 0)
  };

  // Calculate average reaction time
  const reactionTimes = exercises.filter(ex => ex.reactionTime).map(ex => ex.reactionTime);
  if (reactionTimes.length > 0) {
    this.summary.averageReactionTime = reactionTimes.reduce((sum, time) => sum + time, 0) / reactionTimes.length;
  }

  // Calculate scores by exercise type
  const attentionExercises = exercises.filter(ex => ex.exerciseType === 'attention');
  const memoryExercises = exercises.filter(ex => ex.exerciseType === 'memory');
  const executiveExercises = exercises.filter(ex => ex.exerciseType === 'executive-function');
  const speedExercises = exercises.filter(ex => ex.exerciseType === 'processing-speed');

  if (attentionExercises.length > 0) {
    this.summary.attentionScore = attentionExercises.reduce((sum, ex) => sum + ex.score, 0) / attentionExercises.length;
  }
  if (memoryExercises.length > 0) {
    this.summary.memoryScore = memoryExercises.reduce((sum, ex) => sum + ex.score, 0) / memoryExercises.length;
  }
  if (executiveExercises.length > 0) {
    this.summary.executiveFunctionScore = executiveExercises.reduce((sum, ex) => sum + ex.score, 0) / executiveExercises.length;
  }
  if (speedExercises.length > 0) {
    this.summary.processingSpeedScore = speedExercises.reduce((sum, ex) => sum + ex.score, 0) / speedExercises.length;
  }
};

// Method to add exercise result
trainingSessionSchema.methods.addExerciseResult = function(exerciseResult) {
  this.exercises.push(exerciseResult);
  this.calculateSummary();
};

// Method to end session
trainingSessionSchema.methods.endSession = function() {
  this.endTime = new Date();
  this.status = 'completed';
  this.calculateSummary();
};

// Virtual for session duration in minutes
trainingSessionSchema.virtual('durationMinutes').get(function() {
  return this.duration ? Math.round(this.duration / 60 * 100) / 100 : 0;
});

// Virtual for overall performance
trainingSessionSchema.virtual('overallPerformance').get(function() {
  if (!this.summary.averageScore) return 0;
  
  if (this.summary.averageScore >= 90) return 'excellent';
  if (this.summary.averageScore >= 80) return 'good';
  if (this.summary.averageScore >= 70) return 'fair';
  if (this.summary.averageScore >= 60) return 'poor';
  return 'very-poor';
});

// Ensure virtual fields are serialized
trainingSessionSchema.set('toJSON', { virtuals: true });
trainingSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('TrainingSession', trainingSessionSchema);