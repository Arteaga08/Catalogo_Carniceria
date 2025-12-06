// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js"; // Importamos el modelo de usuario

// Middleware para proteger rutas (verifica la autenticación del usuario)
const protect = asyncHandler(async (req, res, next) => {
  let token;
  console.log("🛡️ PROTECT MIDDLEWARE INICIADO");

  // Comprobamos si hay un token en el encabezado de autorización
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const authHeader = req.headers.authorization;
      // Extraemos el token (ignorando "Bearer ")
      token = req.headers.authorization.split(" ")[1];
      console.log("Token recibido:", token);

      // Verificamos el token con la clave secreta
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token Decodificado:", decoded);

      const userId = decoded.userId || decoded.id || decoded._id;

      if (!userId) {
        console.error(
          "❌ Error: El token no tiene campo 'id', 'userId' o '_id'"
        );
        res.status(401);
        throw new Error("Token mal formado: falta ID de usuario");
      }

      // Buscamos al usuario por el ID decodificado (excluyendo la contraseña)
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        // <-- Añadimos un chequeo por si el usuario no existe
        res.status(404);
        throw new Error("Usuario no encontrado para el token proporcionado");
      }

      next(); // Pasamos al siguiente middleware/controlador
    } catch (error) {
      console.error("ERROR EN VERIFICACIÓN DE TOKEN:"); // <-- Etiqueta para el error
      console.error("Tipo de error:", error.name); // <-- NUEVO: Nombre del tipo de error (ej. TokenExpiredError)
      console.error("Mensaje de error:", error.message); // <-- NUEVO: Mensaje específico del error JWT

      res.status(401).json({
        message: "No autorizado. Token inválido o expirado.",
        details: error.message, // Enviamos el detalle del error JWT
      });
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("No autorizado, no hay token");
  }
});

// Middleware para verificar si el usuario es administrador
const admin = (req, res, next) => {
  // Asumimos que `req.user` ya fue adjuntado por el middleware `protect`
  if (req.user && req.user.role === "admin") {
    next(); // Si es admin, pasamos al siguiente middleware/controlador
  } else {
    res.status(403); // 403 Forbidden
    throw new Error("No autorizado como administrador");
  }
};

// Middleware para verificar si el usuario es editor (o admin, ya que admin > editor)
const editor = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "editor")) {
    next();
  } else {
    res.status(403);
    throw new Error("No autorizado como editor");
  }
};

export { protect, admin, editor };
