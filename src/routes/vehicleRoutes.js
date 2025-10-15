const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

// Todas las rutas son públicas (sin middleware de autenticación)
router.route('/')
  .get(getVehicles)
  .post(createVehicle);

router.route('/:id')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

module.exports = router;

