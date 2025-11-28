// backend/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs"; // <-- IMPORTANTE: Necesitas 'fs' para crear directorios

// 1. Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const categorySlug = req.headers['x-category-slug'] || 'general';

    const uploadPath = path.join("uploads", categorySlug);

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        console.error("Error al crear el directorio de subida:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. Filtro para validar el tipo de archivo (solo imágenes)
function checkFileType(file, cb) {
  // Tipos de archivos permitidos (considera añadir webp si lo usarás)
  const filetypes = /jpeg|jpg|png|gif|webp/;
  // Comprobar la extensión del archivo
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Comprobar el mimetype
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // No hay error, el archivo es válido
  } else {
    cb("Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)!", false); // Error, archivo no válido
  }
}

// 3. Inicializar Multer con la configuración
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5MB
});

// Exportar la instancia de Multer para usarla en las rutas
export { upload };
