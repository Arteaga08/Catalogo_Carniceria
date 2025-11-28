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

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Email o contraseña inválidos');
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

  const userRole = role || "user"
  const user = await User.create({
    name,
    email,
    password,
    role: userRole,// Permitimos definir el rol al registrar (útil para la creación manual o seeder)
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password; // Mongoose manejará el hash aquí si tu modelo lo tiene configurado
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role; // Permite al admin cambiar el rol
    // No permitimos cambiar la contraseña de otro usuario directamente por seguridad,
    // o sería una ruta/proceso diferente (ej. resetear contraseña).

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.role === 'admin') { // Seguridad: No permitir eliminar al propio admin si es el único
        res.status(400);
        throw new Error('No se puede eliminar un usuario administrador');
    }
    await User.deleteOne({_id: user._id}); // o await user.remove(); (si estás en Mongoose < 6)
    res.json({ message: 'Usuario eliminado exitosamente' });
  } else {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
});

export { authUser, loginUser, getUserProfile, registerUser, updateUserProfile, getUserById, updateUser, deleteUser };
