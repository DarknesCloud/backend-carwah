const PaymentAdjustment = require('../models/PaymentAdjustment');
const Employee = require('../models/Employee');

// @desc    Get all payment adjustments
// @route   GET /api/adjustments
// @access  Public
exports.getAdjustments = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    let query = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const adjustments = await PaymentAdjustment.find(query)
      .populate('employee', 'name email')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: adjustments.length,
      data: adjustments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get adjustment by ID
// @route   GET /api/adjustments/:id
// @access  Public
exports.getAdjustment = async (req, res) => {
  try {
    const adjustment = await PaymentAdjustment.findById(req.params.id)
      .populate('employee', 'name email');

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: adjustment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create payment adjustment
// @route   POST /api/adjustments
// @access  Public
exports.createAdjustment = async (req, res) => {
  try {
    const { employeeId, amount, type, description, date, createdBy } = req.body;

    // Validar que el empleado existe
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    const adjustment = await PaymentAdjustment.create({
      employee: employeeId,
      amount,
      type,
      description,
      date: date || new Date(),
      createdBy: createdBy || 'admin'
    });

    const populatedAdjustment = await PaymentAdjustment.findById(adjustment._id)
      .populate('employee', 'name email');

    res.status(201).json({
      success: true,
      data: populatedAdjustment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update payment adjustment
// @route   PUT /api/adjustments/:id
// @access  Public
exports.updateAdjustment = async (req, res) => {
  try {
    const { amount, type, description, date } = req.body;

    let adjustment = await PaymentAdjustment.findById(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    adjustment = await PaymentAdjustment.findByIdAndUpdate(
      req.params.id,
      { amount, type, description, date },
      { new: true, runValidators: true }
    ).populate('employee', 'name email');

    res.status(200).json({
      success: true,
      data: adjustment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete payment adjustment
// @route   DELETE /api/adjustments/:id
// @access  Public
exports.deleteAdjustment = async (req, res) => {
  try {
    const adjustment = await PaymentAdjustment.findByIdAndDelete(req.params.id);

    if (!adjustment) {
      return res.status(404).json({
        success: false,
        message: 'Adjustment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Adjustment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

