const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // User Type and Role
  userType: {
    type: String,
    enum: ['child', 'parent', 'clinician', 'admin'],
    required: true
  },
  
  // Child-specific fields
  dateOfBirth: {
    type: Date
  },
  age: {
    type: Number,
    min: 3,
    max: 18
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  
  // Disability Information (for children)
  disabilities: [{
    type: {
      type: String,
      enum: ['ADHD', 'Autism', 'Learning Disability', 'Intellectual Disability', 'Other']
    },
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe']
    },
    description: String
  }],
  
  // Cognitive Assessment Scores
  cognitiveScores: {
    attention: { type: Number, min: 0, max: 100 },
    memory: { type: Number, min: 0, max: 100 },
    executiveFunction: { type: Number, min: 0, max: 100 },
    processingSpeed: { type: Number, min: 0, max: 100 },
    visualSpatial: { type: Number, min: 0, max: 100 },
    lastAssessment: { type: Date }
  },
  
  // Relationships
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  clinicianId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Preferences and Settings
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'high-contrast'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    accessibility: {
      fontSize: { type: String, enum: ['small', 'medium', 'large'], default: 'medium' },
      audioFeedback: { type: Boolean, default: false },
      simplifiedUI: { type: Boolean, default: false }
    }
  },
  
  // Training Progress
  trainingProgress: {
    totalSessions: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }, // in minutes
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastSessionDate: { type: Date }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Timestamps
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ userType: 1 });
userSchema.index({ parentId: 1 });
userSchema.index({ clinicianId: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Method to calculate age
userSchema.methods.calculateAge = function() {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Virtual for age calculation
userSchema.virtual('calculatedAge').get(function() {
  return this.calculateAge();
});

// Method to update cognitive scores
userSchema.methods.updateCognitiveScores = function(scores) {
  this.cognitiveScores = {
    ...this.cognitiveScores,
    ...scores,
    lastAssessment: new Date()
  };
  return this.save();
};

// Method to get training statistics
userSchema.methods.getTrainingStats = function() {
  return {
    totalSessions: this.trainingProgress.totalSessions,
    totalTime: this.trainingProgress.totalTime,
    currentStreak: this.trainingProgress.currentStreak,
    longestStreak: this.trainingProgress.longestStreak,
    averageSessionTime: this.trainingProgress.totalSessions > 0 
      ? Math.round(this.trainingProgress.totalTime / this.trainingProgress.totalSessions) 
      : 0
  };
};

// JSON serialization
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);