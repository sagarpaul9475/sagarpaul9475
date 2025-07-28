const express = require('express');
const TrainingSession = require('../models/TrainingSession');
const EEGData = require('../models/EEGData');

const router = express.Router();

// @route   GET /api/progress/:childId
// @desc    Get progress summary for child
// @access  Private
router.get('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const days = parseInt(req.query.days) || 30;

    const [trainingProgress, eegSummary] = await Promise.all([
      TrainingSession.getProgressSummary(childId, days),
      EEGData.getEEGSummary(childId, days)
    ]);

    res.json({
      trainingProgress,
      eegSummary: eegSummary[0] || null,
      period: `${days} days`
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
