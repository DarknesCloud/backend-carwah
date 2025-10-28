require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/authRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleTypeRoutes = require('./routes/vehicleTypeRoutes');
const serviceTypeRoutes = require('./routes/serviceTypeRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const reportRoutes = require('./routes/reportRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adjustmentRoutes = require('./routes/adjustmentRoutes');

// Connect to database
connectDB();

// Initialize express app
const app = express();

// ===== MIDDLEWARES =====

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'frontend-carwash-4yh8.vercel.app', // Ajusta con tu dominio real de frontend
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Permite envío de cookies o cabeceras de auth
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicle-types', vehicleTypeRoutes);
app.use('/api/service-types', serviceTypeRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/adjustments', adjustmentRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '✅ Server is running and healthy',
  });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error('❌ Global Error Handler:', err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
  console.log('✅ MongoDB connected and API ready');
});

module.exports = app;
