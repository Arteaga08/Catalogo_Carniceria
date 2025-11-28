import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from "./routes/productRoutes.js"
import userRoute from "./routes/userRoutes.js"


// Cargar variables de entorno
dotenv.config();

// Inicializar la Conexión a MongoDB
connectDB(); 

const app = express();
const PORT = process.env.PORT || 5001;

// MIDDLEWARE
app.use(cors()); // **IMPORTANTE: Resuelve el 403**
app.use(express.json());

// RUTAS DE LA API
app.get('/', (req, res) => {
    res.send('API de Carnicería activa. Bienvenido al backend MERN.');
});

// Implementación de la ruta
app.use('/api/categories', categoryRoutes); 

app.use('/api/products', productRoutes); 

app.use("/api/users", userRoute)

// Middlewares de manejo de errores.
app.use(notFound);
app.use(errorHandler);


// LISTENER
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});