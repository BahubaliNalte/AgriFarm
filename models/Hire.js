const mongoose = require('mongoose');

const HireSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farmer', required: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  hireDuration: { type: Number, required: true },
  salary: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Add acceptedBy field
});

module.exports = mongoose.model('Hire', HireSchema);