const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Fetch user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Account is deactivated'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Invalid token'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Authentication failed'
    });
  }
};

// Middleware to check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Access denied',
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user is clinician
const requireClinician = requireRole(['clinician', 'admin']);

// Middleware to check if user is patient
const requirePatient = requireRole(['patient', 'admin']);

// Middleware to check if user is parent
const requireParent = requireRole(['parent', 'admin']);

// Middleware to check if user is admin
const requireAdmin = requireRole(['admin']);

// Middleware to check if user can access patient data
const canAccessPatient = async (req, res, next) => {
  try {
    const patientId = req.params.patientId || req.body.patientId;
    
    if (!patientId) {
      return res.status(400).json({
        error: 'Bad request',
        message: 'Patient ID is required'
      });
    }

    // Admin can access all patients
    if (req.user.role === 'admin') {
      return next();
    }

    // Clinicians can access their assigned patients
    if (req.user.role === 'clinician') {
      const hasAccess = req.user.clinicianInfo.patients.includes(patientId);
      if (hasAccess) {
        return next();
      }
    }

    // Patients can access their own data
    if (req.user.role === 'patient' && req.user._id.toString() === patientId) {
      return next();
    }

    // Parents can access their children's data
    if (req.user.role === 'parent') {
      const patient = await User.findById(patientId);
      if (patient && patient.patientInfo.parents.includes(req.user._id)) {
        return next();
      }
    }

    return res.status(403).json({
      error: 'Access denied',
      message: 'You do not have permission to access this patient\'s data'
    });
  } catch (error) {
    console.error('Patient access check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Access check failed'
    });
  }
};

// Middleware to validate request body
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        message: error.details[0].message
      });
    }
    next();
  };
};

// Middleware to handle rate limiting for specific endpoints
const rateLimitByUser = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map();

  return (req, res, next) => {
    const userId = req.user ? req.user._id.toString() : req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    if (!requests.has(userId)) {
      requests.set(userId, []);
    }

    const userRequests = requests.get(userId);
    const recentRequests = userRequests.filter(time => time > windowStart);

    if (recentRequests.length >= max) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Rate limit exceeded'
      });
    }

    recentRequests.push(now);
    requests.set(userId, recentRequests);

    next();
  };
};

// Clean up old requests periodically
setInterval(() => {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  
  for (const [userId, requests] of requests.entries()) {
    const recentRequests = requests.filter(time => time > now - windowMs);
    if (recentRequests.length === 0) {
      requests.delete(userId);
    } else {
      requests.set(userId, recentRequests);
    }
  }
}, 60 * 1000); // Clean up every minute

module.exports = {
  authenticateToken,
  requireRole,
  requireClinician,
  requirePatient,
  requireParent,
  requireAdmin,
  canAccessPatient,
  validateRequest,
  rateLimitByUser
};