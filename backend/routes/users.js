const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authorize } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', async (req, res) => {
  try {
    res.json({ user: req.user.getPublicProfile() });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('email').optional().isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/children
// @desc    Get children for parent
// @access  Private (Parent only)
router.get('/children', authorize('parent'), async (req, res) => {
  try {
    const children = await User.findChildrenByParent(req.user._id);
    res.json({ children });
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/users/patients
// @desc    Get patients for clinician
// @access  Private (Clinician only)
router.get('/patients', authorize('clinician'), async (req, res) => {
  try {
    const patients = await User.findPatientsByClinician(req.user._id);
    res.json({ patients });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
