// backend/utils/generateToken.js
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'; // Para cargar variables de entorno

dotenv.config(); // Cargar variables de entorno desde .env

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // El token expirará en 30 días
  });
};

export default generateToken;