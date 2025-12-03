// backend/middleware/uploadMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";

// 1. Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // 🟢 CORRECCIÓN: Usar una ruta estática para todos los productos
    const uploadPath = path.join("uploads", "products");

    fs.mkdir(uploadPath, { recursive: true }, (err) => {
      if (err) {
        // 🚨 Es crucial que este log se revise si hay problemas de permisos.
        console.error("Error al crear el directorio de subida:", err);
        return cb(err);
      }
      cb(null, uploadPath);
    });
  },
  filename(req, file, cb) {
    // Usa un nombre único y seguro
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 2. Filtro para validar el tipo de archivo (solo imágenes)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // ⚠️ Asegúrate de que el error aquí sea manejado por Multer y no rompa el servidor
    cb("Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)!", false);
  }
}

// 3. Inicializar Multer con la configuración
const upload = multer({
  storage: storage,
 // fileFilter: function (req, file, cb) {
   // checkFileType(file, cb);
  //},
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5MB
});

// Exportar la instancia de Multer para usarla en las rutas
export { upload };
