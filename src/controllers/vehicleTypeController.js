const VehicleType = require('../models/VehicleType');

// @desc    Get all vehicle types
// @route   GET /api/vehicle-types
// @access  Private
exports.getVehicleTypes = async (req, res) => {
  try {
    const vehicleTypes = await VehicleType.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: vehicleTypes.length,
      data: vehicleTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle type
// @route   GET /api/vehicle-types/:id
// @access  Private
exports.getVehicleType = async (req, res) => {
  try {
    const vehicleType = await VehicleType.findById(req.params.id);

    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicleType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create vehicle type
// @route   POST /api/vehicle-types
// @access  Private
exports.createVehicleType = async (req, res) => {
  try {
    const vehicleType = await VehicleType.create(req.body);

    res.status(201).json({
      success: true,
      data: vehicleType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle type
// @route   PUT /api/vehicle-types/:id
// @access  Private
exports.updateVehicleType = async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicleType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vehicle type
// @route   DELETE /api/vehicle-types/:id
// @access  Private
exports.deleteVehicleType = async (req, res) => {
  try {
    const vehicleType = await VehicleType.findByIdAndDelete(req.params.id);

    if (!vehicleType) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

