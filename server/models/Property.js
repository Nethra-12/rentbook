const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    rooms: { type: Number, required: true, min: 1 },
    occupied: { type: Number, default: 0 },
    monthlyRent: { type: Number, required: true, min: 0 },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);