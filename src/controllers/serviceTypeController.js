const ServiceType = require('../models/ServiceType');

// @desc    Get all service types
// @route   GET /api/service-types
// @access  Private
exports.getServiceTypes = async (req, res) => {
  try {
    const serviceTypes = await ServiceType.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: serviceTypes.length,
      data: serviceTypes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single service type
// @route   GET /api/service-types/:id
// @access  Private
exports.getServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findById(req.params.id);

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceType
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create service type
// @route   POST /api/service-types
// @access  Private
exports.createServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.create(req.body);

    res.status(201).json({
      success: true,
      data: serviceType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update service type
// @route   PUT /api/service-types/:id
// @access  Private
exports.updateServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      data: serviceType
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete service type
// @route   DELETE /api/service-types/:id
// @access  Private
exports.deleteServiceType = async (req, res) => {
  try {
    const serviceType = await ServiceType.findByIdAndDelete(req.params.id);

    if (!serviceType) {
      return res.status(404).json({
        success: false,
        message: 'Service type not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Service type deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

