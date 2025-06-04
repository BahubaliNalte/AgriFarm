const mongoose = require('mongoose');

const FarmSchema = new mongoose.Schema({
  farmName: { type: String, required: true },
  location: { type: String, required: true },
  area: { type: Number, required: true },
  soilType: { type: String, required: true },
  waterSource: { type: String, required: true },
  documents: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Add createdBy field
});

module.exports = mongoose.model('Farm', FarmSchema);