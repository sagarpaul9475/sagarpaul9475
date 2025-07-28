const express = require('express');
const EEGData = require('../models/EEGData');

const router = express.Router();

// @route   GET /api/eeg/data/:childId
// @desc    Get EEG data for child
// @access  Private
router.get('/data/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const eegData = await EEGData.find({ childId })
      .sort({ 'recording.startTime': -1 })
      .limit(10);

    res.json({ eegData });
  } catch (error) {
    console.error('Get EEG data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/eeg/data
// @desc    Store EEG data
// @access  Private
router.post('/data', async (req, res) => {
  try {
    const eegData = new EEGData(req.body);
    await eegData.save();

    res.status(201).json({
      message: 'EEG data stored successfully',
      data: eegData
    });
  } catch (error) {
    console.error('Store EEG data error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
