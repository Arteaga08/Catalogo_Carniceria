import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url"; // Necesario para obtener __dirname en ES Modules

// 🟢 1. DEFINICIÓN DE RUTAS ABSOLUTAS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Subimos un nivel de 'middleware' para llegar a la raíz del 'backend'
const ROOT_DIR = path.join(__dirname, "..");

// 2. Configuración del almacenamiento de Multer
const storage = multer.diskStorage({
  destination(req, file, cb) {
    // 🟢 CORRECCIÓN: Usamos la RUTA ABSOLUTA garantizada
    const uploadPath = path.join(ROOT_DIR, "uploads", "products");

    // Log para depuración (opcional, ayuda a verificar la ruta)
    console.log(`RUTA DE GUARDADO ABSOLUTA DE MULTER: ${uploadPath}`);

    // Asegura que el directorio exista (con la bandera 'recursive: true')
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
    // Usa un nombre único basado en el campo y la marca de tiempo
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// 3. Filtro para validar el tipo de archivo (solo imágenes)
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Solo se permiten imágenes (JPEG, JPG, PNG, GIF, WebP)!", false);
  }
}

// 4. Inicializar Multer con la configuración
const upload = multer({
  storage: storage,
  // Descomenta la siguiente línea si quieres activar el filtro de tipo de archivo
  // fileFilter: function (req, file, cb) {
  //   checkFileType(file, cb);
  // },
  limits: { fileSize: 5 * 1024 * 1024 }, // Límite de tamaño: 5MB
});

// Exportar la instancia de Multer
export { upload };
