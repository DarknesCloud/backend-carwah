const mongoose = require('mongoose');

const paymentAdjustmentSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: [true, 'Employee is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required']
  },
  type: {
    type: String,
    enum: ['advance', 'bonus', 'deduction', 'correction', 'other'],
    required: [true, 'Type is required']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  appliedToPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  createdBy: {
    type: String,
    default: 'admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Índice para búsquedas por empleado y fecha
paymentAdjustmentSchema.index({ employee: 1, date: -1 });

module.exports = mongoose.model('PaymentAdjustment', paymentAdjustmentSchema);

