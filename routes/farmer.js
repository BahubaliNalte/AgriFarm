const express = require('express');
const router = express.Router();
const Farmer = require('../models/Farmer');
const { protect } = require('../middleware/auth');

// Farmer registration
router.post('/register', protect, async (req, res) => {
  const { fullName, aadharNo, phoneNumber, address, experience, preferredCrops } = req.body;

  try {
    const farmer = new Farmer({
      fullName,
      aadharNo,
      phoneNumber,
      address,
      experience,
      preferredCrops,
      createdBy: req.user._id // Associate the farmer with the logged-in user
    });
    await farmer.save();

    // Render a success message or redirect to the dashboard
    res.render('farmerRegistration', { message: 'Farmer registered successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;