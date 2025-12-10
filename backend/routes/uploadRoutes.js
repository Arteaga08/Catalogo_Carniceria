// backend/routes/uploadRoutes.js
import express from "express";
const router = express.Router();
import { uploadProducts as upload } from "../middleware/uploadMiddleware.js";
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
    if (req.file) {
      // 🟢 CORRECCIÓN: DEVOLVER LA RUTA COMPLETA CON EL PREFIJO 'products'
      // Ya que Multer está configurado para guardar en 'uploads/products'

      // req.file.filename contiene 'image-12345.png'
      const finalImageUrl = `/uploads/products/${req.file.filename}`;

      // ⚠️ Asegúrate de que tu frontend usa 'imageUrl' y no 'imageURL' (si el frontend usa 'imageURL' cámbialo aquí)
      res.json({ imageUrl: finalImageUrl });
    } else {
      res.status(400);
      throw new Error("No se pudo subir la imagen");
    }
  }
);

export default router;
