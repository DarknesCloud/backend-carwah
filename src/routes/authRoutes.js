const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');

// Todas las rutas son públicas (sin middleware de autenticación)
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;

