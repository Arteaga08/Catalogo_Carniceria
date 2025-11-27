// backend/controllers/userController.js
import asyncHandler from "express-async-handler"; // Para manejar excepciones en funciones asíncronas de Express
import User from "../models/userModel.js"; // Importamos el modelo de usuario
import generateToken from "../utils/generateToken.js"; // Importamos la función para generar el token

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // Si el usuario existe y la contraseña coincide
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // Incluimos el rol en la respuesta
      token: generateToken(user._id), // Generamos el token
    });
  } else {
    // Si las credenciales son incorrectas
    res.status(401); // 401 Unauthorized
    throw new Error("Email o contraseña inválidos");
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private (requiere token de autenticación)
// Por ahora, solo tendremos el perfil para el usuario logueado.
// Más adelante, lo protegeremos con un middleware.
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user viene del middleware de autenticación que aún no hemos creado,
  // pero lo incluimos aquí para prepararnos.
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(404); // Not Found
    throw new Error("Usuario no encontrado");
  }
});

// @desc    Register a new user (Aunque no tendremos un signup público, esta función puede ser útil
//          si en el futuro se desea crear usuarios admin/editor desde el propio panel por otro admin)
// @route   POST /api/users
// @access  Private/Admin (Necesitará protección de admin)
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // Bad Request
    throw new Error("Ya existe un usuario con ese email");
  }

  const user = await User.create({
    name,
    email,
    password,
    role, // Permitimos definir el rol al registrar (útil para la creación manual o seeder)
  });

  if (user) {
    res.status(201).json({
      // 201 Created
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Datos de usuario inválidos");
  }
});

export { authUser, getUserProfile, registerUser };
