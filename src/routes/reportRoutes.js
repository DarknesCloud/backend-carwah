const express = require('express');
const router = express.Router();
const {
  getEmployeeReport,
  getVehicleReport,
  getDashboardStats
} = require('../controllers/reportController');

// Todas las rutas son públicas (sin middleware de autenticación)
router.get('/employee', getEmployeeReport);
router.get('/vehicles', getVehicleReport);
router.get('/dashboard', getDashboardStats);

module.exports = router;

