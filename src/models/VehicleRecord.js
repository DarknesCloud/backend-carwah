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
  // MODIFICADO: Ahora es un array de servicios
  services: [{
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceType',
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    }
  }],
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  entryTime: {
    type: Date,
    default: Date.now
  },
  // MODIFICADO: Precio total calculado de todos los servicios
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Price cannot be negative']
  },
  // NUEVO: Estado de pago
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'pending'
  },
  // NUEVO: Fecha de pago
  paidAt: {
    type: Date
  },
  // NUEVO: Método de pago
  paymentMethod: {
    type: String,
    enum: ['efectivo', 'transferencia'],
    required: [true, 'Payment method is required'],
    default: 'efectivo'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas rápidas por estado de pago
vehicleRecordSchema.index({ paymentStatus: 1, createdAt: -1 });

module.exports = mongoose.model('VehicleRecord', vehicleRecordSchema);

