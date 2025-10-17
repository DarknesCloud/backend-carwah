const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  // Período del pago
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  // Vehículos incluidos en este pago
  vehicleRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'VehicleRecord'
  }],
  // Notas adicionales
  notes: {
    type: String,
    trim: true
  },
  // Estado del pago
  status: {
    type: String,
    enum: ['pending', 'paid'],
    default: 'paid'
  },
  paidAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas por empleado y fecha
paymentSchema.index({ employee: 1, paidAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);

