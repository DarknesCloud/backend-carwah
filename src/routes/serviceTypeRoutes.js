const express = require('express');
const router = express.Router();
const {
  getServiceTypes,
  getServiceType,
  createServiceType,
  updateServiceType,
  deleteServiceType
} = require('../controllers/serviceTypeController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getServiceTypes)
  .post(createServiceType);

router.route('/:id')
  .get(getServiceType)
  .put(updateServiceType)
  .delete(deleteServiceType);

module.exports = router;

