const express = require('express');
const router = express.Router();
const {
  getVehicleTypes,
  getVehicleType,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType
} = require('../controllers/vehicleTypeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getVehicleTypes)
  .post(createVehicleType);

router.route('/:id')
  .get(getVehicleType)
  .put(updateVehicleType)
  .delete(deleteVehicleType);

module.exports = router;

