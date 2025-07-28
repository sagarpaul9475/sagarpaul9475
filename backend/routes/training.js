const express = require('express');
const TrainingSession = require('../models/TrainingSession');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/training/sessions
// @desc    Get training sessions
// @access  Private
router.get('/sessions', async (req, res) => {
  try {
    let query = {};
    
    if (req.user.role === 'child') {
      query.childId = req.user._id;
    } else if (req.user.role === 'parent') {
      const children = await User.findChildrenByParent(req.user._id);
      query.childId = { $in: children.map(child => child._id) };
    } else if (req.user.role === 'clinician') {
      query.clinicianId = req.user._id;
    }

    const sessions = await TrainingSession.find(query)
      .populate('childId', 'firstName lastName')
      .populate('clinicianId', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.json({ sessions });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/training/sessions
// @desc    Create training session
// @access  Private (Clinician only)
router.post('/sessions', authorize('clinician'), async (req, res) => {
  try {
    const sessionData = {
      ...req.body,
      clinicianId: req.user._id,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    const session = new TrainingSession(sessionData);
    await session.save();

    res.status(201).json({
      message: 'Training session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
