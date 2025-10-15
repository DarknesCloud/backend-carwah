const express = require('express');
const router = express.Router();
const {
  getVehicleTypes,
  getVehicleType,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType
} = require('../controllers/vehicleTypeController');

// Todas las rutas son públicas (sin middleware de autenticación)
router.route('/')
  .get(getVehicleTypes)
  .post(createVehicleType);

router.route('/:id')
  .get(getVehicleType)
  .put(updateVehicleType)
  .delete(deleteVehicleType);

module.exports = router;

