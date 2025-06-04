const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Farmer = require('../models/Farmer');
const Farm = require('../models/Farm');
const Lease = require('../models/Lease');
const Hire = require('../models/Hire');
const Product = require('../models/Store');

router.get('/', (req, res) => {
  res.render('landingPage');
});

router.get('/register', (req, res) => {
  res.render('registerPage');
});

router.get('/login', (req, res) => {
  res.render('loginPage');
});

router.get('/dashboard', protect, (req, res) => {
  res.render('dashboard');
});

router.get('/farmer-registration', protect, (req, res) => {
  res.render('farmerRegistration');
});

router.get('/farm-registration', protect, (req, res) => {
  res.render('farmRegistration');
});

router.get('/storeManagement', protect, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).lean(); // Fetch products owned by the logged-in user
    res.render('storeManagement', { products, user: req.user }); // Pass the user object to the template
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/owner', protect, async (req, res) => {
  try {
    const farmers = await Farmer.find().lean();
    const farms = await Farm.find().lean();

    // Fetch lease details for each farm
    for (let farm of farms) {
      const lease = await Lease.findOne({ farmId: farm._id, status: 'accepted' }).lean();
      if (lease) {
        farm.lease = lease;
      }
    }

    // Fetch hire details for each farmer
    for (let farmer of farmers) {
      const hire = await Hire.findOne({ farmerId: farmer._id, status: 'accepted' }).lean();
      if (hire) {
        farmer.hire = hire;
      }
    }

    res.render('ownerPage', { farmers, farms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/feedback', (req, res) => {
  res.render('feedback');
});

module.exports = router;