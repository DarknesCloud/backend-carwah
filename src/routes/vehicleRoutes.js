const express = require('express');
const router = express.Router();
const {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  markAsPaid
} = require('../controllers/vehicleController');

// Rutas públicas
router.route('/')
  .get(getVehicles)
  .post(createVehicle);

router.route('/:id')
  .get(getVehicle)
  .put(updateVehicle)
  .delete(deleteVehicle);

// Ruta para marcar como pagado
router.patch('/:id/pay', markAsPaid);

module.exports = router;

