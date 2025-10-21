const express = require('express');
const router = express.Router();
const {
  getAdjustments,
  getAdjustment,
  createAdjustment,
  updateAdjustment,
  deleteAdjustment
} = require('../controllers/adjustmentController');

router.route('/')
  .get(getAdjustments)
  .post(createAdjustment);

router.route('/:id')
  .get(getAdjustment)
  .put(updateAdjustment)
  .delete(deleteAdjustment);

module.exports = router;

