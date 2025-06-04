const mongoose = require('mongoose');

const LeaseSchema = new mongoose.Schema({
  farmId: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String, required: true },
  leaseDuration: { type: Number, required: true },
  rent: { type: Number, required: true },
  payment: { type: String, required: true },
  status: { type: String, default: 'pending' },
  acceptedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Add acceptedBy field
});

module.exports = mongoose.model('Lease', LeaseSchema);