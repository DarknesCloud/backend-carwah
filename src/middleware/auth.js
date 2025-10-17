const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware para proteger rutas autenticadas.
 * Soporta tokens en cookies o en headers (Authorization: Bearer <token>).
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Buscar token en cookie o header
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log('✅ Token encontrado en cookie');
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log('✅ Token encontrado en header Authorization');
    } else {
      console.warn(
        '❌ No se encontró token en cookies ni en header Authorization'
      );
    }

    // 2️⃣ Si no hay token → no autorizado
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    // 3️⃣ Verificar token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Buscar usuario en la base de datos
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // 5️⃣ Adjuntar usuario a la request
    req.user = user;

    next();
  } catch (error) {
    console.error('❌ Error de autenticación:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

module.exports = { protect };
