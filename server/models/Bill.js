const mongoose = require('mongoose');

const billSchema = new mongoose.Schema(
  {
    month: { type: String, required: true },
    rent: { type: Number, required: true, min: 0 },
    electricity: { type: Number, default: 0, min: 0 },
    water: { type: Number, default: 0, min: 0 },
    internet: { type: Number, default: 0, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'paid'],
      default: 'pending',
    },
    dueDate: { type: Date, required: true },
    paidOn: { type: Date },
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// A virtual is computed on read, never stored in the database.
billSchema.virtual('total').get(function () {
  return this.rent + this.electricity + this.water + this.internet;
});

module.exports = mongoose.model('Bill', billSchema);