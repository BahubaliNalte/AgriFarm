const Product = require('../models/Store');

const checkOwnership = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product || product.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: You do not own this product' });
    }

    req.product = product; // Attach the product to the request object for further use
    next();
  } catch (error) {
    console.error('Error checking ownership:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkOwnership };