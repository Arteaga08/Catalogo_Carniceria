// Archivo: backend/routes/productRoutes.js

import express from 'express';
import { 
    getProducts, 
    getProductBySlug,
    getProductsByCategory 
} from '../controllers/productController.js'; // Importa las funciones del controlador

const router = express.Router();

// Ruta principal: GET /api/products
router.route('/').get(getProducts);

// Ruta para productos por categoría: GET /api/products/category/:categorySlug
router.route('/category/:categorySlug').get(getProductsByCategory);

// Ruta para un producto específico: GET /api/products/:slug
router.route('/:slug').get(getProductBySlug);

export default router;