// Archivo: backend/server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Carnicería activa. Bienvenido al backend MERN.');
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Accede en: http://localhost:${PORT}`);
});