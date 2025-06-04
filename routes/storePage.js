const express = require('express');
const router = express.Router();
const Product = require('../models/Store'); // Ensure the correct path to the model

// Render the store page
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products
    res.render('store', { products }); // Pass all products to the EJS template
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;