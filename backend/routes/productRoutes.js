import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
} from "../controllers/productController.js";


router.get('/search', searchProducts);
// @desc    Obtener productos por categoría (usando el slug en la URL)
// @route   GET /api/products/category/:slug
// @access  Public
router.get("/category/:slug", getProductsByCategory);

// @desc    Obtener todos los productos
// @route   GET /api/products
// @access  Public
router.get("/", getProducts);

// @desc    Obtener un solo producto por slug
// @route   GET /api/products/:slug
// @access  Public
router.get("/:slug", getProductBySlug);

router.get('/search', searchProducts);

export default router;
