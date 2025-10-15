const express = require('express');
const router = express.Router();
const {
  getEmployeeReport,
  getVehicleReport,
  getDashboardStats
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/employee', getEmployeeReport);
router.get('/vehicles', getVehicleReport);
router.get('/dashboard', getDashboardStats);

module.exports = router;

