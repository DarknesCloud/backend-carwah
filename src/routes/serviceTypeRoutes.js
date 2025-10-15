const express = require('express');
const router = express.Router();
const {
  getServiceTypes,
  getServiceType,
  createServiceType,
  updateServiceType,
  deleteServiceType
} = require('../controllers/serviceTypeController');

// Todas las rutas son públicas (sin middleware de autenticación)
router.route('/')
  .get(getServiceTypes)
  .post(createServiceType);

router.route('/:id')
  .get(getServiceType)
  .put(updateServiceType)
  .delete(deleteServiceType);

module.exports = router;

