const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password, userType } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ name, email, password, userType });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('token', token, { httpOnly: true });

    // Redirect with success query parameter
    res.redirect('/register?success=true');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d'
    });

    res.cookie('token', token, { httpOnly: true });

    if (user.userType === 'farmer') {
      res.redirect('/dashboard');
    } else if (user.userType === 'owner') {
      res.redirect('/owner');
    } else if (user.userType === 'customer') {
      res.redirect('/store'); // Redirect to store page for customers
    } else {
      res.redirect('/');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.redirect('/');
});

module.exports = router;