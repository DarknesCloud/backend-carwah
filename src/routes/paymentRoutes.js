const express = require('express');
const router = express.Router();
const {
  getPaymentSummary,
  getDailyPaymentSummary,
  createPayment,
  getPayments,
  deletePayment
} = require('../controllers/paymentController');

// Rutas públicas
router.get('/summary', getPaymentSummary);
router.get('/daily', getDailyPaymentSummary);
router.route('/')
  .get(getPayments)
  .post(createPayment);
router.delete('/:id', deletePayment);

module.exports = router;

