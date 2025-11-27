// backend/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'; // Importamos el modelo de usuario

// Middleware para proteger rutas (verifica la autenticación del usuario)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Comprobamos si hay un token en el encabezado de autorización
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extraemos el token (ignorando "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Verificamos el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario por el ID decodificado (excluyendo la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Pasamos al siguiente middleware/controlador
    } catch (error) {
      console.error('Error al verificar el token:', error);
      res.status(401);
      throw new Error('No autorizado, token fallido');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('No autorizado, no hay token');
  }
});

// Middleware para verificar si el usuario es administrador
const admin = (req, res, next) => {
  // Asumimos que `req.user` ya fue adjuntado por el middleware `protect`
  if (req.user && req.user.role === 'admin') {
    next(); // Si es admin, pasamos al siguiente middleware/controlador
  } else {
    res.status(403); // 403 Forbidden
    throw new Error('No autorizado como administrador');
  }
};

// Middleware para verificar si el usuario es editor (o admin, ya que admin > editor)
const editor = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'editor')) {
        next();
    } else {
        res.status(403);
        throw new Error('No autorizado como editor');
    }
};


export { protect, admin, editor };