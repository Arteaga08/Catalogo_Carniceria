// backend/routes/uploadRoutes.js
import express from "express";
const router = express.Router();
import { upload } from "../middleware/uploadMiddleware.js";
import { protect, admin, editor } from "../middleware/authMiddleware.js";

// Middleware combinado para verificar si es admin o editor
const isAdminOrEditor = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "editor")) {
    next();
  } else {
    res.status(403);
    throw new Error("No autorizado como Admin o Editor para subir imágenes");
  }
};

// Ruta para subir imágenes
router.post(
  "/",
  protect,
  isAdminOrEditor,
  upload.single("image"),
  (req, res) => {
    // Si la subida fue exitosa, req.file contendrá la información del archivo
    if (req.file) {
      const categorySlug = req.headers['x-category-slug'] || 'general';
      // Devolvemos la URL accesible públicamente del archivo
      const imageUrl = `/uploads/${categorySlug}/${req.file.filename}`;
      res.json({ imageUrl: `/uploads/${req.file.filename}` });
    } else {
      // Si multer falló por alguna razón (ej. tipo de archivo inválido), lanzará un error
      // que será capturado por el errorHandler global
      res.status(400);
      throw new Error("No se pudo subir la imagen");
    }
  }
);

export default router;
