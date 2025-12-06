import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import userRoute from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Cargar variables de entorno
dotenv.config();

console.log("🟡 JWT_SECRET cargada:", process.env.JWT_SECRET ? "SÍ" : "NO");

// Inicializar la Conexión a MongoDB
connectDB();

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // <--- CRUCIAL
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
app.use((req, res, next) => {
  console.log(`📡 SOLICITUD ENTRANTE: ${req.method} ${req.originalUrl}`);
  console.log(
    "🔑 Header Auth:",
    req.headers.authorization ? "PRESENTE" : "FALTANTE"
  );
  next();
});
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  // Permite que la aplicación frontend (si es conocida) acceda.
  // Si la URL de tu frontend es diferente a 3000, cámbiala.
  // O puedes usar true para permitir todos los orígenes, pero es menos seguro.
  origin: "http://localhost:3000",

  // Permite los métodos necesarios, incluyendo PUT y DELETE
  methods: ["GET", "POST", "PUT", "DELETE"],

  // 🛑 CRUCIAL: Autoriza los headers que contienen el Token
  allowedHeaders: ["Content-Type", "Authorization"],

  // Permite enviar cookies/headers de autenticación (si se usaran credenciales)
  credentials: true,
};

// MIDDLEWARE
app.use(cors(corsOptions)); // **IMPORTANTE: Resuelve el 403**
app.use(express.json());

// RUTAS DE LA API
app.get("/", (req, res) => {
  res.send("API de Carnicería activa. Bienvenido al backend MERN.");
});

// Implementación de la ruta
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoute);
app.use("/api/upload", uploadRoutes);

//Img Upload
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Middlewares de manejo de errores.
app.use(notFound);
app.use(errorHandler);

// LISTENER
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
