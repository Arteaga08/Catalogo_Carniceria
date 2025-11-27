import express from 'express';
import { authUser, getUserProfile, registerUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js'; // Importamos los middlewares de protección

const router = express.Router();
// Ruta para registrar un nuevo usuario (solo para administradores o creación manual)
// Usamos .route('/') para encadenar métodos HTTP para la misma ruta
router.post('/register', protect, admin, registerUser); // Solo un admin puede registrar nuevos usuarios

// Ruta para la autenticación de usuarios (Login)
router.post('/login', authUser);

// Ruta para obtener el perfil del usuario autenticado
// Se protege con `protect` para asegurar que solo usuarios logueados puedan acceder
// .route('/profile') es otra forma de definir rutas
router
  .route('/profile')
  .get(protect, getUserProfile); // GET para obtener el perfil del usuario autenticado

// 🚨 IMPORTANTE: Necesitamos conectar estas rutas en tu archivo principal `server.js` (o `app.js`)
// Abre tu archivo `backend/server.js` y añade:
// import userRoutes from './routes/userRoutes.js';
// app.use('/api/users', userRoutes);

export default router;