const mongoose = require('mongoose');

const FarmerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  aadharNo: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  address: { type: String, required: true },
  experience: { type: Number, required: true },
  preferredCrops: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add createdBy field
});

module.exports = mongoose.model('Farmer', FarmerSchema);