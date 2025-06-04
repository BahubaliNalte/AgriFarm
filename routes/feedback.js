// filepath: c:\Bahubali\FMS\routes\feedback.js
const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

// Submit feedback
router.post('/', async (req, res) => {
  const { name, review } = req.body;

  try {
    const feedback = new Feedback({ name, review });
    await feedback.save();
    res.redirect('/');
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all feedback
router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedback:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;