const mongoose = require('mongoose');

const eegDataSchema = new mongoose.Schema({
  // Session Reference
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  trainingSessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingSession',
    required: true
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Device Information
  deviceInfo: {
    deviceModel: { type: String, required: true },
    serialNumber: String,
    firmwareVersion: String,
    samplingRate: { type: Number, required: true }, // Hz
    channels: { type: Number, required: true },
    electrodePositions: [String] // e.g., ['Fp1', 'Fp2', 'F3', 'F4', ...]
  },
  
  // Recording Details
  recording: {
    startTime: { type: Date, required: true },
    endTime: { type: Date },
    duration: { type: Number }, // in seconds
    quality: {
      type: String,
      enum: ['excellent', 'good', 'fair', 'poor'],
      default: 'good'
    },
    artifacts: [{
      type: { type: String, enum: ['blink', 'movement', 'muscle', 'electrical'] },
      timestamp: Date,
      duration: Number,
      severity: { type: String, enum: ['low', 'medium', 'high'] }
    }]
  },
  
  // Raw EEG Data (stored as compressed binary or references to files)
  rawData: {
    dataFormat: { type: String, enum: ['binary', 'csv', 'edf', 'json'] },
    filePath: String, // Path to stored raw data file
    compressionType: String,
    checksum: String,
    sizeBytes: Number
  },
  
  // Processed Brainwave Data
  brainwaves: {
    // Frequency bands (Hz)
    delta: {
      range: { min: 0.5, max: 4 },
      power: [Number], // Power values over time
      avgPower: Number,
      peakFrequency: Number
    },
    theta: {
      range: { min: 4, max: 8 },
      power: [Number],
      avgPower: Number,
      peakFrequency: Number
    },
    alpha: {
      range: { min: 8, max: 13 },
      power: [Number],
      avgPower: Number,
      peakFrequency: Number
    },
    beta: {
      range: { min: 13, max: 30 },
      power: [Number],
      avgPower: Number,
      peakFrequency: Number
    },
    gamma: {
      range: { min: 30, max: 100 },
      power: [Number],
      avgPower: Number,
      peakFrequency: Number
    }
  },
  
  // Cognitive State Metrics
  cognitiveStates: {
    attention: {
      sustained: [Number], // Time series data
      selective: [Number],
      divided: [Number],
      avgScore: Number,
      peakScore: Number,
      consistency: Number // Variability measure
    },
    focus: {
      level: [Number], // 0-100 scale
      avgLevel: Number,
      peakLevel: Number,
      focusDuration: Number, // seconds in focused state
      distractionEvents: [{
        timestamp: Date,
        duration: Number,
        severity: Number
      }]
    },
    relaxation: {
      level: [Number],
      avgLevel: Number,
      stressIndicators: [Number],
      relaxationPeriods: [{
        startTime: Date,
        duration: Number,
        quality: String
      }]
    },
    mentalWorkload: {
      level: [Number],
      avgWorkload: Number,
      peakWorkload: Number,
      cognitiveLoad: [Number],
      fatigueIndicators: [Number]
    }
  },
  
  // Neurofeedback Metrics
  neurofeedback: {
    protocol: {
      type: String,
      required: true,
      enum: ['SMR', 'Beta', 'Alpha/Theta', 'Gamma', 'Custom']
    },
    targetFrequencies: [{
      band: String,
      minFreq: Number,
      maxFreq: Number,
      targetPower: Number
    }],
    rewardThreshold: Number,
    inhibitThreshold: Number,
    rewardEvents: [{
      timestamp: Date,
      duration: Number,
      intensity: Number,
      type: String
    }],
    inhibitEvents: [{
      timestamp: Date,
      reason: String,
      duration: Number
    }],
    trainingEfficiency: {
      rewardRate: Number, // rewards per minute
      consistencyScore: Number,
      improvementRate: Number
    }
  },
  
  // Real-time Processing
  realTimeMetrics: {
    processingDelay: Number, // milliseconds
    dataLoss: Number, // percentage
    signalQuality: [{
      channel: String,
      quality: Number, // 0-100
      impedance: Number,
      timestamp: Date
    }],
    calibrationData: {
      baselineAlpha: Number,
      baselineBeta: Number,
      baselineTheta: Number,
      personalThresholds: mongoose.Schema.Types.Mixed
    }
  },
  
  // Analysis Results
  analysis: {
    spectralAnalysis: {
      powerSpectralDensity: mongoose.Schema.Types.Mixed,
      coherenceAnalysis: mongoose.Schema.Types.Mixed,
      asymmetryMetrics: mongoose.Schema.Types.Mixed
    },
    timeFrequencyAnalysis: {
      waveletCoefficients: mongoose.Schema.Types.Mixed,
      spectrograms: [String], // paths to spectrogram images
      eventRelatedPotentials: mongoose.Schema.Types.Mixed
    },
    connectivityAnalysis: {
      functionalConnectivity: mongoose.Schema.Types.Mixed,
      networkMetrics: mongoose.Schema.Types.Mixed,
      brainNetworkStates: [String]
    },
    machineLearningSummary: {
      cognitiveStateClassification: String,
      confidenceScore: Number,
      featureImportance: mongoose.Schema.Types.Mixed,
      anomalyDetection: [{
        timestamp: Date,
        anomalyType: String,
        severity: Number
      }]
    }
  },
  
  // Clinical Annotations
  clinicalNotes: {
    preSessionNotes: String,
    observationsDuringSession: [String],
    postSessionNotes: String,
    behavioralCorrelations: [{
      behavior: String,
      eegCorrelation: String,
      timestamp: Date,
      confidence: Number
    }],
    clinicalRecommendations: [String]
  },
  
  // Data Quality and Validation
  dataQuality: {
    overallQuality: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    signalToNoiseRatio: Number,
    artifactPercentage: Number,
    usableDataPercentage: Number,
    qualityFlags: [String],
    validationChecks: [{
      checkType: String,
      passed: Boolean,
      details: String
    }]
  },
  
  // Export and Sharing
  exports: [{
    format: { type: String, enum: ['csv', 'edf', 'json', 'matlab'] },
    filePath: String,
    exportedAt: Date,
    exportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    purpose: String
  }],
  
  // Privacy and Compliance
  privacy: {
    anonymized: { type: Boolean, default: false },
    consentLevel: { type: String, enum: ['basic', 'research', 'full'] },
    retentionPeriod: Date,
    sharingPermissions: {
      clinician: { type: Boolean, default: true },
      researcher: { type: Boolean, default: false },
      parent: { type: Boolean, default: true }
    }
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  processedAt: Date
});

// Indexes for efficient querying
eegDataSchema.index({ childId: 1, 'recording.startTime': -1 });
eegDataSchema.index({ trainingSessionId: 1 });
eegDataSchema.index({ sessionId: 1 });
eegDataSchema.index({ 'recording.startTime': 1 });
eegDataSchema.index({ 'dataQuality.overallQuality': 1 });

// Pre-save middleware
eegDataSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Calculate duration if not set
  if (this.recording.startTime && this.recording.endTime && !this.recording.duration) {
    this.recording.duration = Math.round(
      (this.recording.endTime - this.recording.startTime) / 1000
    );
  }
  
  next();
});

// Virtual for session duration in minutes
eegDataSchema.virtual('durationMinutes').get(function() {
  return this.recording.duration ? Math.round(this.recording.duration / 60) : 0;
});

// Static method to get EEG summary for a child
eegDataSchema.statics.getEEGSummary = async function(childId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        childId: mongoose.Types.ObjectId(childId),
        'recording.startTime': { $gte: startDate }
      }
    },
    {
      $group: {
        _id: null,
        totalSessions: { $sum: 1 },
        avgFocusLevel: { $avg: '$cognitiveStates.focus.avgLevel' },
        avgRelaxationLevel: { $avg: '$cognitiveStates.relaxation.avgLevel' },
        avgMentalWorkload: { $avg: '$cognitiveStates.mentalWorkload.avgWorkload' },
        totalRecordingTime: { $sum: '$recording.duration' },
        avgAlphaPower: { $avg: '$brainwaves.alpha.avgPower' },
        avgBetaPower: { $avg: '$brainwaves.beta.avgPower' },
        avgThetaPower: { $avg: '$brainwaves.theta.avgPower' }
      }
    }
  ]);
};

// Static method to find sessions with good quality data
eegDataSchema.statics.findQualitySessions = function(childId, quality = 'good') {
  const qualityLevels = ['excellent', 'good', 'fair', 'poor'];
  const minQualityIndex = qualityLevels.indexOf(quality);
  const acceptableQualities = qualityLevels.slice(0, minQualityIndex + 1);
  
  return this.find({
    childId,
    'dataQuality.overallQuality': { $in: acceptableQualities }
  }).sort({ 'recording.startTime': -1 });
};

// Instance method to calculate neurofeedback effectiveness
eegDataSchema.methods.calculateNeurofeedbackEffectiveness = function() {
  if (!this.neurofeedback.rewardEvents.length) return 0;
  
  const totalRewards = this.neurofeedback.rewardEvents.length;
  const sessionDuration = this.recording.duration / 60; // in minutes
  const rewardRate = totalRewards / sessionDuration;
  
  const consistency = this.neurofeedback.trainingEfficiency.consistencyScore || 0;
  const improvement = this.neurofeedback.trainingEfficiency.improvementRate || 0;
  
  // Weighted effectiveness score
  return Math.round((rewardRate * 0.4) + (consistency * 0.3) + (improvement * 0.3));
};

// Instance method to detect attention patterns
eegDataSchema.methods.detectAttentionPatterns = function() {
  const attention = this.cognitiveStates.attention;
  if (!attention.sustained.length) return null;
  
  const patterns = {
    peaks: [],
    valleys: [],
    trends: 'stable',
    consistency: attention.consistency || 0
  };
  
  // Simple peak/valley detection
  for (let i = 1; i < attention.sustained.length - 1; i++) {
    const prev = attention.sustained[i - 1];
    const curr = attention.sustained[i];
    const next = attention.sustained[i + 1];
    
    if (curr > prev && curr > next) {
      patterns.peaks.push({ index: i, value: curr });
    } else if (curr < prev && curr < next) {
      patterns.valleys.push({ index: i, value: curr });
    }
  }
  
  // Determine trend
  const firstHalf = attention.sustained.slice(0, Math.floor(attention.sustained.length / 2));
  const secondHalf = attention.sustained.slice(Math.floor(attention.sustained.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  if (secondAvg > firstAvg * 1.1) patterns.trends = 'improving';
  else if (secondAvg < firstAvg * 0.9) patterns.trends = 'declining';
  
  return patterns;
};

// Ensure virtual fields are serialized
eegDataSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('EEGData', eegDataSchema);