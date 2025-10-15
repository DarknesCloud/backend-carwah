const mongoose = require('mongoose');

const vehicleTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Vehicle type name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleType', vehicleTypeSchema);

