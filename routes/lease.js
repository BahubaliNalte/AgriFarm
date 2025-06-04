const express = require('express');
const router = express.Router();
const Lease = require('../models/Lease');
const Farm = require('../models/Farm');
const { protect } = require('../middleware/auth.js');

// Lease a farm
router.post('/', async (req, res) => {
  const { farmId, ownerName, ownerPhone, leaseDuration, rent, payment } = req.body;

  try {
    const lease = new Lease({ farmId, ownerName, ownerPhone, leaseDuration, rent, payment });
    await lease.save();
    res.status(201).json({ message: 'Farm leased successfully' });
  } catch (error) {
    console.error('Error leasing farm:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch lease requests
router.get('/requests', protect, async (req, res) => {
  try {
    const leases = await Lease.find({ status: 'pending' }) // Fetch only pending requests
      .populate('farmId')
      .lean();

    const leaseRequests = leases.filter(lease => lease.farmId.createdBy.toString() === req.user._id.toString())
      .map(lease => ({
        _id: lease._id,
        farmName: lease.farmId.farmName,
        ownerName: lease.ownerName,
        ownerPhone: lease.ownerPhone,
        leaseDuration: lease.leaseDuration,
        rent: lease.rent,
        payment: lease.payment
      }));

    res.json(leaseRequests);
  } catch (error) {
    console.error('Error fetching lease requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Fetch accepted lease requests
router.get('/accepted', protect, async (req, res) => {
  try {
    const leases = await Lease.find({ status: 'accepted', acceptedBy: req.user._id }).populate('farmId');
    const acceptedLeases = leases.map(lease => ({
      _id: lease._id,
      farmName: lease.farmId.farmName,
      ownerName: lease.ownerName,
      ownerPhone: lease.ownerPhone,
      leaseDuration: lease.leaseDuration,
      rent: lease.rent,
      payment: lease.payment
    }));
    res.json(acceptedLeases);
  } catch (error) {
    console.error('Error fetching accepted lease requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept lease request
router.post('/accept/:id', protect, async (req, res) => {
  try {
    const lease = await Lease.findById(req.params.id);
    if (!lease) {
      return res.status(404).json({ message: 'Lease request not found' });
    }
    lease.status = 'accepted';
    lease.acceptedBy = req.user._id; // Store the ID of the farmer who accepted the request
    await lease.save();

    // Remove the accepted request from the "requests" section
    res.status(200).json({ message: 'Lease request accepted and removed from requests' });
  } catch (error) {
    console.error('Error accepting lease request:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;