const express = require('express');
const User = require('../models/User');
const TrainingSession = require('../models/TrainingSession');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/clinician/dashboard
// @desc    Get clinician dashboard data
// @access  Private (Clinician only)
router.get('/dashboard', authorize('clinician'), async (req, res) => {
  try {
    const clinicianId = req.user._id;

    const [patients, recentSessions, upcomingSessions] = await Promise.all([
      User.findPatientsByClinician(clinicianId),
      TrainingSession.find({ clinicianId })
        .populate('childId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(10),
      TrainingSession.find({
        clinicianId,
        status: 'scheduled',
        scheduledTime: { $gte: new Date() }
      })
        .populate('childId', 'firstName lastName')
        .sort({ scheduledTime: 1 })
        .limit(5)
    ]);

    res.json({
      patients,
      recentSessions,
      upcomingSessions,
      stats: {
        totalPatients: patients.length,
        sessionsToday: recentSessions.filter(s => 
          s.createdAt.toDateString() === new Date().toDateString()
        ).length
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
