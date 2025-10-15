const User = require('../models/User');

// @desc    Login user (sin JWT, solo validación)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Check for user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Retornar usuario sin token
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Logout user (solo respuesta exitosa)
// @route   POST /api/auth/logout
// @access  Public
exports.logout = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User logged out successfully'
  });
};

// @desc    Get current logged in user (mock - siempre retorna success)
// @route   GET /api/auth/me
// @access  Public
exports.getMe = async (req, res) => {
  try {
    // Como no hay autenticación real, retornamos un usuario genérico
    res.status(200).json({
      success: true,
      data: {
        email: 'user@example.com',
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

