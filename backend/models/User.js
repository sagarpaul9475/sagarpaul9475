const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
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
  
  // User Role
  role: {
    type: String,
    enum: ['child', 'parent', 'clinician', 'admin'],
    required: true
  },
  
  // Profile Information
  avatar: {
    type: String,
    default: null
  },
  dateOfBirth: {
    type: Date,
    required: function() {
      return this.role === 'child';
    }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: function() {
      return this.role === 'child';
    }
  },
  
  // Medical Information (for children)
  medicalInfo: {
    diagnosis: {
      type: String,
      required: function() {
        return this.role === 'child';
      }
    },
    disabilities: [{
      type: String,
      enum: [
        'ADHD',
        'Autism Spectrum Disorder',
        'Learning Disability',
        'Intellectual Disability',
        'Cerebral Palsy',
        'Down Syndrome',
        'Other'
      ]
    }],
    medications: [{
      name: String,
      dosage: String,
      frequency: String
    }],
    allergies: [String],
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },
  
  // Relationships
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: function() {
      return this.role === 'child';
    }
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  assignedClinician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  patients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Professional Information (for clinicians)
  professionalInfo: {
    license: {
      type: String,
      required: function() {
        return this.role === 'clinician';
      }
    },
    specialization: {
      type: String,
      required: function() {
        return this.role === 'clinician';
      }
    },
    experience: Number,
    institution: String,
    qualifications: [String]
  },
  
  // Settings and Preferences
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    },
    privacy: {
      shareData: { type: Boolean, default: false },
      allowResearch: { type: Boolean, default: false }
    },
    accessibility: {
      fontSize: { type: String, default: 'medium' },
      highContrast: { type: Boolean, default: false },
      voiceAssist: { type: Boolean, default: false }
    }
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
  lastLogin: {
    type: Date,
    default: null
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ parentId: 1 });
userSchema.index({ assignedClinician: 1 });

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

// Update timestamp on save
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.medicalInfo;
  return userObject;
};

// Static method to find children by parent
userSchema.statics.findChildrenByParent = function(parentId) {
  return this.find({ parentId, role: 'child' });
};

// Static method to find patients by clinician
userSchema.statics.findPatientsByClinician = function(clinicianId) {
  return this.find({ assignedClinician: clinicianId, role: 'child' });
};

// Virtual for age calculation
userSchema.virtual('age').get(function() {
  if (!this.dateOfBirth) return null;
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);