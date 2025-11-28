// backend/routes/productRoutes.js
import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, admin, editor } from '../middleware/authMiddleware.js';

// --- Rutas Públicas (GETs) ---

// @route   GET /api/products
// @desc    Obtener todos los productos (con paginación, filtros y búsqueda)
// @access  Public
// Nota: La lógica de búsqueda y filtrado se maneja en getProducts
router.route('/').get(getProducts);

// @route   GET /api/products/search?q=query
// @desc    Busca productos por nombre o descripción
// @access  Public
// Nota: Esta ruta /search DEBE ir antes de /:slug para que Express no confunda 'search' con un slug
router.route('/search').get(searchProducts);

// @route   GET /api/products/category/:categorySlug
// @desc    Obtiene productos por una categoría (slug)
// @access  Public
router.route('/category/:categorySlug').get(getProductsByCategory);

// @route   GET /api/products/:slug
// @desc    Obtiene un producto por su slug
// @access  Public
router.route('/:slug').get(getProductBySlug);


// --- Rutas Protegidas (CRUD - Crear, Actualizar, Eliminar) ---

// @route   POST /api/products
// @desc    Crear un nuevo producto
// @access  Private/Admin/Editor
// Solo administradores y editores pueden crear productos
router.route('/').post(protect, editor, createProduct); // editor permite admin también


// @route   PUT /api/products/:slug
// @desc    Actualizar un producto existente (por slug)
// @access  Private/Admin/Editor
// Solo administradores y editores pueden actualizar productos
router.route('/:slug').put(protect, editor, updateProduct);

// @route   DELETE /api/products/:slug
// @desc    Eliminar un producto (por slug)
// @access  Private/Admin
// Solo administradores pueden eliminar productos
router.route('/:slug').delete(protect, admin, deleteProduct);


export default router;