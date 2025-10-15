const VehicleRecord = require('../models/VehicleRecord');

// @desc    Get all vehicle records
// @route   GET /api/vehicles
// @access  Private
exports.getVehicles = async (req, res) => {
  try {
    const { startDate, endDate, employeeId, vehicleTypeId } = req.query;
    
    let query = {};

    // Filter by date range
    if (startDate || endDate) {
      query.entryTime = {};
      if (startDate) {
        query.entryTime.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.entryTime.$lte = end;
      }
    }

    // Filter by employee
    if (employeeId) {
      query.employee = employeeId;
    }

    // Filter by vehicle type
    if (vehicleTypeId) {
      query.vehicleType = vehicleTypeId;
    }

    const vehicles = await VehicleRecord.find(query)
      .populate('vehicleType', 'name')
      .populate('serviceType', 'name price')
      .populate('employee', 'name email')
      .sort({ entryTime: -1 });

    res.status(200).json({
      success: true,
      count: vehicles.length,
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single vehicle record
// @route   GET /api/vehicles/:id
// @access  Private
exports.getVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleRecord.findById(req.params.id)
      .populate('vehicleType', 'name description')
      .populate('serviceType', 'name description price')
      .populate('employee', 'name email phone');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create vehicle record
// @route   POST /api/vehicles
// @access  Private
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleRecord.create(req.body);

    const populatedVehicle = await VehicleRecord.findById(vehicle._id)
      .populate('vehicleType', 'name')
      .populate('serviceType', 'name price')
      .populate('employee', 'name email');

    res.status(201).json({
      success: true,
      data: populatedVehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update vehicle record
// @route   PUT /api/vehicles/:id
// @access  Private
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate('vehicleType', 'name')
      .populate('serviceType', 'name price')
      .populate('employee', 'name email');

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle record not found'
      });
    }

    res.status(200).json({
      success: true,
      data: vehicle
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete vehicle record
// @route   DELETE /api/vehicles/:id
// @access  Private
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await VehicleRecord.findByIdAndDelete(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle record not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Vehicle record deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

