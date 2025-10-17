const Payment = require('../models/Payment');
const VehicleRecord = require('../models/VehicleRecord');
const Employee = require('../models/Employee');

// @desc    Get payment summary for a specific date range
// @route   GET /api/payments/summary
// @access  Public
exports.getPaymentSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateQuery = {};
    if (startDate || endDate) {
      dateQuery.entryTime = {};
      if (startDate) {
        dateQuery.entryTime.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        dateQuery.entryTime.$lte = end;
      }
    }

    // Solo vehículos pagados
    dateQuery.paymentStatus = 'paid';

    // Obtener todos los vehículos pagados del período
    const vehicles = await VehicleRecord.find(dateQuery)
      .populate('employee', 'name email commissionPercentage')
      .populate('services.serviceType', 'name price');

    // Calcular totales por empleado
    const employeePayments = {};
    let totalRevenue = 0;

    vehicles.forEach(vehicle => {
      const employeeId = vehicle.employee._id.toString();
      const commission = vehicle.employee.commissionPercentage || 50;
      const employeeEarning = (vehicle.totalPrice * commission) / 100;

      if (!employeePayments[employeeId]) {
        employeePayments[employeeId] = {
          employee: {
            id: vehicle.employee._id,
            name: vehicle.employee.name,
            email: vehicle.employee.email,
            commissionPercentage: commission
          },
          totalWashes: 0,
          totalRevenue: 0,
          totalEarnings: 0,
          vehicles: []
        };
      }

      employeePayments[employeeId].totalWashes += 1;
      employeePayments[employeeId].totalRevenue += vehicle.totalPrice;
      employeePayments[employeeId].totalEarnings += employeeEarning;
      employeePayments[employeeId].vehicles.push({
        id: vehicle._id,
        plate: vehicle.plate,
        totalPrice: vehicle.totalPrice,
        earning: employeeEarning,
        entryTime: vehicle.entryTime
      });

      totalRevenue += vehicle.totalPrice;
    });

    const employeePaymentsArray = Object.values(employeePayments);
    const totalEmployeePayments = employeePaymentsArray.reduce(
      (sum, emp) => sum + emp.totalEarnings, 
      0
    );

    res.status(200).json({
      success: true,
      data: {
        period: {
          startDate: startDate || null,
          endDate: endDate || null
        },
        summary: {
          totalRevenue,
          totalEmployeePayments,
          remainingCash: totalRevenue - totalEmployeePayments,
          totalWashes: vehicles.length
        },
        employeePayments: employeePaymentsArray
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get daily payment summary
// @route   GET /api/payments/daily
// @access  Public
exports.getDailyPaymentSummary = async (req, res) => {
  try {
    const { date } = req.query;
    
    const targetDate = date ? new Date(date) : new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Solo vehículos pagados del día
    const vehicles = await VehicleRecord.find({
      entryTime: {
        $gte: startOfDay,
        $lte: endOfDay
      },
      paymentStatus: 'paid'
    })
      .populate('employee', 'name email commissionPercentage')
      .populate('services.serviceType', 'name price');

    // Calcular totales por empleado
    const employeePayments = {};
    let totalRevenue = 0;

    vehicles.forEach(vehicle => {
      const employeeId = vehicle.employee._id.toString();
      const commission = vehicle.employee.commissionPercentage || 50;
      const employeeEarning = (vehicle.totalPrice * commission) / 100;

      if (!employeePayments[employeeId]) {
        employeePayments[employeeId] = {
          employee: {
            id: vehicle.employee._id,
            name: vehicle.employee.name,
            email: vehicle.employee.email,
            commissionPercentage: commission
          },
          totalWashes: 0,
          totalRevenue: 0,
          totalEarnings: 0
        };
      }

      employeePayments[employeeId].totalWashes += 1;
      employeePayments[employeeId].totalRevenue += vehicle.totalPrice;
      employeePayments[employeeId].totalEarnings += employeeEarning;

      totalRevenue += vehicle.totalPrice;
    });

    const employeePaymentsArray = Object.values(employeePayments);
    const totalEmployeePayments = employeePaymentsArray.reduce(
      (sum, emp) => sum + emp.totalEarnings, 
      0
    );

    res.status(200).json({
      success: true,
      data: {
        date: targetDate.toISOString().split('T')[0],
        summary: {
          totalRevenue,
          totalEmployeePayments,
          remainingCash: totalRevenue - totalEmployeePayments,
          totalWashes: vehicles.length
        },
        employeePayments: employeePaymentsArray
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create payment record for employee
// @route   POST /api/payments
// @access  Public
exports.createPayment = async (req, res) => {
  try {
    const { employeeId, startDate, endDate, vehicleRecordIds, notes } = req.body;

    // Validar que el empleado existe
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    // Obtener vehículos y calcular total
    const vehicles = await VehicleRecord.find({
      _id: { $in: vehicleRecordIds },
      employee: employeeId,
      paymentStatus: 'paid'
    });

    const commission = employee.commissionPercentage || 50;
    const totalAmount = vehicles.reduce((sum, vehicle) => {
      return sum + (vehicle.totalPrice * commission) / 100;
    }, 0);

    // Crear registro de pago
    const payment = await Payment.create({
      employee: employeeId,
      amount: totalAmount,
      startDate,
      endDate,
      vehicleRecords: vehicleRecordIds,
      notes,
      status: 'paid',
      paidAt: new Date()
    });

    const populatedPayment = await Payment.findById(payment._id)
      .populate('employee', 'name email commissionPercentage')
      .populate('vehicleRecords');

    res.status(201).json({
      success: true,
      data: populatedPayment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Public
exports.getPayments = async (req, res) => {
  try {
    const { employeeId, startDate, endDate } = req.query;
    
    let query = {};

    if (employeeId) {
      query.employee = employeeId;
    }

    if (startDate || endDate) {
      query.paidAt = {};
      if (startDate) {
        query.paidAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.paidAt.$lte = end;
      }
    }

    const payments = await Payment.find(query)
      .populate('employee', 'name email commissionPercentage')
      .sort({ paidAt: -1 });

    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Public
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

