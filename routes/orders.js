const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// Create a new order
router.post('/', async (req, res) => {
  const { name, address, phone, payment, cart } = req.body;

  if (!name || !address || !phone || !payment || !cart) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newOrder = new Order({ name, address, phone, payment, cart });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;