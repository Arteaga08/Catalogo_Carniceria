// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // Para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env

const generateToken = (user) => {
  return jwt.sign({ 
    id: user._id || user.id, 
    role: user.role 
  }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expirará en 30 días
  });
};

export default generateToken;