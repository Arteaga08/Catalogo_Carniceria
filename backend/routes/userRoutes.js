// backend/routes/userRoutes.js
import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import { validateRegisterUser, validateLoginUser, validateUpdateUser, validateUpdateUserProfile } from "../middleware/validationMiddleware.js";

// Rutas públicas:
// POST /api/users/login -> Autenticar usuario y obtener token
router.post("/login", validateLoginUser, loginUser);

// Rutas protegidas para el perfil del propio usuario:
// GET /api/users/profile -> Obtener perfil del usuario logueado
// PUT /api/users/profile -> Actualizar perfil del usuario logueado
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, validateUpdateUserProfile, updateUserProfile);

// Rutas protegidas por ADMIN para la gestión de usuarios:
// GET /api/users -> Obtener todos los usuarios
// POST /api/users/register -> Registrar un nuevo usuario (solo para admins si no quieres registro público)
router
  .route("/")
  .get(protect, admin, getUsers)
  .post(protect, admin, validateRegisterUser, registerUser); // Si decides que solo un admin puede registrar

// Rutas protegidas por ADMIN para operaciones sobre un usuario específico por ID:
// GET /api/users/:id -> Obtener detalles de un usuario por ID
// PUT /api/users/:id -> Actualizar los datos de un usuario (incluido el rol)
// DELETE /api/users/:id -> Eliminar un usuario
router
  .route("/:id")
  .get(protect, admin, getUserById)
  .put(protect, admin, validateUpdateUser, updateUser)
  .delete(protect, admin, deleteUser);

export default router;
