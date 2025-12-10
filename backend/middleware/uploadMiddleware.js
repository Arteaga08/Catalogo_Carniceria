// backend/middleware/uploadMiddleware.js

import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, "..");

// 🟢 FUNCIÓN QUE CREA LA INSTANCIA DE MULTER CON DESTINO DINÁMICO
const createUploader = (targetFolder = "temp") => {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      // 🟢 USAMOS LA CARPETA OBJETIVO DEFINIDA
      const uploadPath = path.join(ROOT_DIR, "uploads", targetFolder);

      console.log(`RUTA DE GUARDADO ABSOLUTA: ${uploadPath}`);

      fs.mkdir(uploadPath, { recursive: true }, (err) => {
        if (err) {
          console.error(
            "🚨 Error al crear el directorio de subida (Permisos):",
            err
          );
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

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb("Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)!", false);
    }
  }

  return multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5MB
  });
};

// 🟢 EXPORTACIONES ESPECÍFICAS
const uploadProducts = createUploader("products");
const uploadCategories = createUploader("categories");

export { uploadProducts, uploadCategories };
