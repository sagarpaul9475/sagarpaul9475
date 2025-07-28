const mongoose = require('mongoose');

const eegDataPointSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  alpha: {
    type: Number,
    required: true
  },
  beta: {
    type: Number,
    required: true
  },
  theta: {
    type: Number,
    required: true
  },
  delta: {
    type: Number,
    required: true
  },
  gamma: {
    type: Number,
    required: true
  },
  attention: {
    type: Number,
    min: 0,
    max: 100
  },
  meditation: {
    type: Number,
    min: 0,
    max: 100
  },
  signalQuality: {
    type: Number,
    min: 0,
    max: 100
  }
});

const eegSessionSchema = new mongoose.Schema({
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
    enum: ['baseline', 'training', 'assessment', 'neuro-feedback'],
    required: true
  },
  trainingModule: {
    type: String,
    enum: ['attention', 'memory', 'executive-function', 'processing-speed', 'custom'],
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
  eegData: [eegDataPointSchema],
  summary: {
    averageAlpha: Number,
    averageBeta: Number,
    averageTheta: Number,
    averageDelta: Number,
    averageGamma: Number,
    averageAttention: Number,
    averageMeditation: Number,
    attentionVariability: Number,
    meditationVariability: Number,
    signalQualityAverage: Number
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  tags: [String],
  deviceInfo: {
    deviceType: String,
    deviceId: String,
    firmwareVersion: String,
    samplingRate: Number
  },
  settings: {
    targetAttention: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    targetMeditation: {
      type: Number,
      min: 0,
      max: 100,
      default: 70
    },
    feedbackType: {
      type: String,
      enum: ['visual', 'auditory', 'both'],
      default: 'visual'
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    }
  },
  performance: {
    attentionScore: {
      type: Number,
      min: 0,
      max: 100
    },
    meditationScore: {
      type: Number,
      min: 0,
      max: 100
    },
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    improvement: {
      type: Number // percentage improvement from baseline
    }
  },
  artifacts: [{
    type: String,
    enum: ['blink', 'movement', 'electrode', 'noise', 'other'],
    timestamp: Date,
    description: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
eegSessionSchema.index({ patient: 1, startTime: -1 });
eegSessionSchema.index({ clinician: 1, startTime: -1 });
eegSessionSchema.index({ sessionType: 1, status: 1 });
eegSessionSchema.index({ trainingModule: 1 });

// Pre-save middleware to calculate duration
eegSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  next();
});

// Method to calculate session summary
eegSessionSchema.methods.calculateSummary = function() {
  if (!this.eegData || this.eegData.length === 0) {
    return;
  }

  const data = this.eegData;
  const count = data.length;

  this.summary = {
    averageAlpha: data.reduce((sum, point) => sum + point.alpha, 0) / count,
    averageBeta: data.reduce((sum, point) => sum + point.beta, 0) / count,
    averageTheta: data.reduce((sum, point) => sum + point.theta, 0) / count,
    averageDelta: data.reduce((sum, point) => sum + point.delta, 0) / count,
    averageGamma: data.reduce((sum, point) => sum + point.gamma, 0) / count,
    averageAttention: data.reduce((sum, point) => sum + (point.attention || 0), 0) / count,
    averageMeditation: data.reduce((sum, point) => sum + (point.meditation || 0), 0) / count,
    signalQualityAverage: data.reduce((sum, point) => sum + (point.signalQuality || 0), 0) / count
  };

  // Calculate variability
  const attentionValues = data.map(point => point.attention || 0);
  const meditationValues = data.map(point => point.meditation || 0);
  
  this.summary.attentionVariability = this.calculateVariability(attentionValues);
  this.summary.meditationVariability = this.calculateVariability(meditationValues);
};

// Helper method to calculate variability (standard deviation)
eegSessionSchema.methods.calculateVariability = function(values) {
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
  const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / values.length;
  return Math.sqrt(variance);
};

// Method to add EEG data point
eegSessionSchema.methods.addDataPoint = function(dataPoint) {
  this.eegData.push(dataPoint);
  this.calculateSummary();
};

// Method to end session
eegSessionSchema.methods.endSession = function() {
  this.endTime = new Date();
  this.status = 'completed';
  this.calculateSummary();
};

// Virtual for session duration in minutes
eegSessionSchema.virtual('durationMinutes').get(function() {
  return this.duration ? Math.round(this.duration / 60 * 100) / 100 : 0;
});

// Ensure virtual fields are serialized
eegSessionSchema.set('toJSON', { virtuals: true });
eegSessionSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('EEGSession', eegSessionSchema);