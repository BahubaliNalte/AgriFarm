const express = require('express');
const router = express.Router();
const multer = require('multer');
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Farm registration
router.post('/register', protect, upload.single('documents'), async (req, res) => {
  const { farmName, location, area, soilType, waterSource } = req.body;
  const documents = req.file.path;

  try {
    const farm = new Farm({
      farmName,
      location,
      area,
      soilType,
      waterSource,
      documents,
      createdBy: req.user._id // Associate the farm with the logged-in user
    });
    await farm.save();

    // Render a success message or redirect to the dashboard
    res.render('farmRegistration', { message: 'Farm registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;