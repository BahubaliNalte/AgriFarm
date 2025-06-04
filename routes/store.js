const express = require('express');
const multer = require('multer');
const Product = require('../models/Store'); // Correct the path to the model
const { protect } = require('../middleware/auth'); // Ensure correct import of protect middleware
const { checkOwnership } = require('../middleware/ownership');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to parse JSON bodies
router.use(express.json());

// Get all products
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id }).lean(); // Fetch only products owned by the logged-in user
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single product by ID
router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  res.json(product);
});

// Create a new product
router.post('/', protect, upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;
  const createdBy = req.user._id; // Get the logged-in user's ID

  if (!name || !price || !description || !req.file) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const newProduct = new Product({ name, price, description, imageUrl, createdBy });
  await newProduct.save();
  res.status(201).json(newProduct);
});

// Update a product by ID
router.put('/:id', protect, checkOwnership, upload.single('image'), async (req, res) => {
  const { name, price, description } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : req.product.imageUrl;

  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    { name, price, description, imageUrl },
    { new: true }
  );

  res.json(updatedProduct);
});

// Delete a product by ID
router.delete('/:id', protect, checkOwnership, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

module.exports = router;