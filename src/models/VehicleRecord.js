const mongoose = require('mongoose');

const vehicleRecordSchema = new mongoose.Schema({
  plate: {
    type: String,
    required: [true, 'License plate is required'],
    trim: true,
    uppercase: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  vehicleType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleType',
    required: [true, 'Vehicle type is required']
  },
  serviceType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType',
    required: [true, 'Service type is required']
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  entryTime: {
    type: Date,
    default: Date.now
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('VehicleRecord', vehicleRecordSchema);

