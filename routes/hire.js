const express = require('express');
const router = express.Router();
const Hire = require('../models/Hire');
const Farmer = require('../models/Farmer');
const { protect } = require('../middleware/auth'); // Assuming protect middleware is defined

// Hire a farmer
router.post('/', async (req, res) => {
  const { farmerId, ownerName, ownerPhone, hireDuration, salary, paymentMethod } = req.body;

  if (!ownerName || !ownerPhone) {
    return res.status(400).json({ message: 'Owner name and phone number are required' });
  }

  try {
    const farmer = await Farmer.findById(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const newHire = new Hire({
      farmerId,
      ownerName,
      ownerPhone,
      hireDuration,
      salary,
      paymentMethod
    });
    await newHire.save();
    res.status(201).json({ message: 'Farmer hired successfully' });
  } catch (error) {
    console.error('Error hiring farmer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch hire requests
router.get('/requests', protect, async (req, res) => {
  try {
    const hires = await Hire.find({ status: 'pending' }) // Fetch only pending requests
      .populate('farmerId')
      .lean();

    const hireRequests = hires.filter(hire => hire.farmerId.createdBy.toString() === req.user._id.toString())
      .map(hire => ({
        _id: hire._id,
        farmerName: hire.farmerId.fullName,
        ownerName: hire.ownerName,
        ownerPhone: hire.ownerPhone,
        hireDuration: hire.hireDuration,
        salary: hire.salary,
        paymentMethod: hire.paymentMethod
      }));

    res.json(hireRequests);
  } catch (error) {
    console.error('Error fetching hire requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch accepted hire requests
router.get('/accepted', protect, async (req, res) => {
  try {
    const hires = await Hire.find({ status: 'accepted', acceptedBy: req.user._id }).populate('farmerId');
    const acceptedHires = hires.map(hire => ({
      _id: hire._id,
      farmerName: hire.farmerId.fullName,
      ownerName: hire.ownerName,
      ownerPhone: hire.ownerPhone,
      hireDuration: hire.hireDuration,
      salary: hire.salary,
      paymentMethod: hire.paymentMethod
    }));
    res.json(acceptedHires);
  } catch (error) {
    console.error('Error fetching accepted hire requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept hire request
router.post('/accept/:id', protect, async (req, res) => {
  try {
    const hire = await Hire.findById(req.params.id);
    if (!hire) {
      return res.status(404).json({ message: 'Hire request not found' });
    }
    hire.status = 'accepted';
    hire.acceptedBy = req.user._id; // Store the ID of the farmer who accepted the request
    await hire.save();

    // Remove the accepted request from the "requests" section
    res.status(200).json({ message: 'Hire request accepted and removed from requests' });
  } catch (error) {
    console.error('Error accepting hire request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;