const VehicleRecord = require('../models/VehicleRecord');
const Employee = require('../models/Employee');

// @desc    Get employee report
// @route   GET /api/reports/employee
// @access  Private
exports.getEmployeeReport = async (req, res) => {
  try {
    const { startDate, endDate, employeeId } = req.query;

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

    // Filter by specific employee
    if (employeeId) {
      query.employee = employeeId;
    }

    // Aggregate data by employee
    const report = await VehicleRecord.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$employee',
          totalWashes: { $sum: 1 },
          totalRevenue: { $sum: '$totalPrice' },
          averagePrice: { $avg: '$totalPrice' }
        }
      },
      {
        $lookup: {
          from: 'employees',
          localField: '_id',
          foreignField: '_id',
          as: 'employeeInfo'
        }
      },
      {
        $unwind: '$employeeInfo'
      },
      {
        $project: {
          _id: 1,
          employeeName: '$employeeInfo.name',
          employeeEmail: '$employeeInfo.email',
          totalWashes: 1,
          totalRevenue: { $round: ['$totalRevenue', 2] },
          averagePrice: { $round: ['$averagePrice', 2] }
        }
      },
      {
        $sort: { totalRevenue: -1 }
      }
    ]);

    res.status(200).json({
      success: true,
      count: report.length,
      data: report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get vehicle report
// @route   GET /api/reports/vehicles
// @access  Private
exports.getVehicleReport = async (req, res) => {
  try {
    const { startDate, endDate, vehicleTypeId, serviceTypeId, employeeId } = req.query;

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

    // Filter by vehicle type
    if (vehicleTypeId) {
      query.vehicleType = vehicleTypeId;
    }

    // Filter by service type
    if (serviceTypeId) {
      query.serviceType = serviceTypeId;
    }

    // Filter by employee
    if (employeeId) {
      query.employee = employeeId;
    }

    const vehicles = await VehicleRecord.find(query)
      .populate('vehicleType', 'name')
      .populate('services.serviceType', 'name price')
      .populate('employee', 'name email')
      .sort({ entryTime: -1 });

    // Calculate summary statistics with payment method breakdown
    const summary = {
      totalRecords: vehicles.length,
      totalRevenue: vehicles.reduce((sum, v) => sum + v.totalPrice, 0),
      averagePrice: vehicles.length > 0 
        ? vehicles.reduce((sum, v) => sum + v.totalPrice, 0) / vehicles.length 
        : 0,
      efectivo: {
        count: vehicles.filter(v => v.paymentMethod === 'efectivo').length,
        revenue: vehicles.filter(v => v.paymentMethod === 'efectivo').reduce((sum, v) => sum + v.totalPrice, 0)
      },
      transferencia: {
        count: vehicles.filter(v => v.paymentMethod === 'transferencia').length,
        revenue: vehicles.filter(v => v.paymentMethod === 'transferencia').reduce((sum, v) => sum + v.totalPrice, 0)
      }
    };

    res.status(200).json({
      success: true,
      summary: {
        totalRecords: summary.totalRecords,
        totalRevenue: Math.round(summary.totalRevenue * 100) / 100,
        averagePrice: Math.round(summary.averagePrice * 100) / 100,
        efectivo: {
          count: summary.efectivo.count,
          revenue: Math.round(summary.efectivo.revenue * 100) / 100
        },
        transferencia: {
          count: summary.transferencia.count,
          revenue: Math.round(summary.transferencia.revenue * 100) / 100
        }
      },
      data: vehicles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private
exports.getDashboardStats = async (req, res) => {
  try {
    // Honduras timezone (CST -6)
    const now = new Date();
    const hondurasOffset = -6 * 60; // -6 horas en minutos
    const localOffset = now.getTimezoneOffset();
    const hondurasTime = new Date(now.getTime() + (localOffset + hondurasOffset) * 60000);
    
    const today = new Date(hondurasTime);
    today.setHours(0, 0, 0, 0);

    // Calcular inicio de semana (lunes)
    const thisWeek = new Date(hondurasTime);
    const dayOfWeek = thisWeek.getDay(); // 0 = domingo, 1 = lunes, ...
    const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Si es domingo, retroceder 6 días
    thisWeek.setDate(thisWeek.getDate() - daysToMonday);
    thisWeek.setHours(0, 0, 0, 0);

    const thisMonth = new Date(hondurasTime);
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    // Today's stats
    const todayStats = await VehicleRecord.aggregate([
      { $match: { entryTime: { $gte: today } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // This week's stats
    const weekStats = await VehicleRecord.aggregate([
      { $match: { entryTime: { $gte: thisWeek } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // This month's stats
    const monthStats = await VehicleRecord.aggregate([
      { $match: { entryTime: { $gte: thisMonth } } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' }
        }
      }
    ]);

    // Active employees count
    const activeEmployees = await Employee.countDocuments({ active: true });

    res.status(200).json({
      success: true,
      data: {
        today: {
          washes: todayStats[0]?.count || 0,
          revenue: Math.round((todayStats[0]?.revenue || 0) * 100) / 100
        },
        week: {
          washes: weekStats[0]?.count || 0,
          revenue: Math.round((weekStats[0]?.revenue || 0) * 100) / 100
        },
        month: {
          washes: monthStats[0]?.count || 0,
          revenue: Math.round((monthStats[0]?.revenue || 0) * 100) / 100
        },
        activeEmployees
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

