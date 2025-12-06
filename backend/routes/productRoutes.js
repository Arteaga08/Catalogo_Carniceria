// backend/routes/productRoutes.js
import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

import {
  validateProduct,
  validateProductSlugParam,
  validateCategorySlugParam,
  handleValidationErrors,
} from "../middleware/validationMiddleware.js";

import { upload } from "../middleware/uploadMiddleware.js";

import { protect, admin, editor } from "../middleware/authMiddleware.js";
import { query, param } from "express-validator";

// --- Rutas Públicas (GETs) ---

// @route   GET /api/products
// @desc    Obtener todos los productos (con paginación, filtros y búsqueda)
// @access  Public
// Nota: La lógica de búsqueda y filtrado se maneja en getProducts
// Aquí podríamos añadir validación para `limit` y `q` si es necesario en `getProducts`
router.route("/").get(
  [
    // Opcional: Validaciones para los query params de getProducts si tu getProducts los espera
    // query('limit').optional().isInt({ min: 1 }).withMessage('Limit debe ser un número entero positivo'),
    // query('page').optional().isInt({ min: 1 }).withMessage('Page debe ser un número entero positivo'),
    // query('category').optional().trim().notEmpty().withMessage('Category slug no puede estar vacío'),
    // query('q').optional().trim().notEmpty().withMessage('Query de búsqueda no puede estar vacía'),
    // handleValidationErrors, // Si usas las validaciones de query arriba
  ],
  getProducts
);

// @route   GET /api/products/search?q=query
// @desc    Busca productos por nombre o descripción
// @access  Public
// Nota: Esta ruta /search DEBE ir antes de /:slug para que Express no confunda 'search' con un slug
router
  .route("/search")
  .get(
    [
      query("q")
        .trim()
        .notEmpty()
        .withMessage("El parámetro de búsqueda (q) es requerido"),
      handleValidationErrors,
    ],
    searchProducts
  );

// @route   GET /api/products/category/:categorySlug
// @desc    Obtiene productos por una categoría (slug)
// @access  Public
router.route("/category/:categorySlug").get(
  validateCategorySlugParam, // Valida que el categorySlug en el parámetro de la URL no esté vacío
  getProductsByCategory
);

// @route   GET /api/products/:slug
// @desc    Obtiene un producto por su slug
// @access  Public
router.route("/:slug").get(validateProductSlugParam, getProductBySlug);

// --- Rutas Protegidas (CRUD - Crear, Actualizar, Eliminar) ---
const debugMiddleware = (req, res, next) => {
  console.log("DEBUG 1: Headers (Content-Type):", req.headers["content-type"]);
  console.log("DEBUG 1: req.body ANTES de Multer:", req.body); // Debe ser {} o undefined
  next();
};
// @route   POST /api/products
// @desc    Crear un nuevo producto
// @access  Private/Admin/Editor
// Solo administradores y editores pueden crear productos
router.route("/").post(
  protect,
  editor,
  upload.single("image"),
  (req, res, next) => {
    console.log(
      "DEBUG 2: req.body DESPUÉS de Multer (DEBE FALLAR AQUÍ):",
      req.body
    );
    next();
  },
  validateProduct,
  createProduct
); // Validar datos del producto al crear

// @route   PUT /api/products/:slug
// @desc    Actualizar un producto existente (por slug)
// @access  Private/Admin/Editor
// Solo administradores y editores pueden actualizar productos
router
  .route("/:slug")
  .put(
    protect,
    editor,
    validateProductSlugParam,
    upload.single("image"),
    validateProduct,
    updateProduct
  ); // Validar slug y datos del producto

// @route   DELETE /api/products/:slug
// @desc    Eliminar un producto (por slug)
// @access  Private/Admin
// Solo administradores pueden eliminar productos
router
  .route("/:slug")
  .delete(protect, admin, validateProductSlugParam, deleteProduct); // Validar slug al eliminar

export default router;
