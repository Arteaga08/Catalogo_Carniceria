// Archivo: backend/controllers/productController.js

import Product from "../models/ProductModel.js"; // Asegúrate que el nombre del modelo sea correcto

/**
 * @desc    Obtiene todos los productos
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

/**
 * @desc    Obtiene un producto por su slug (ej. /api/products/bistec-de-res-selecto)
 * @route   GET /api/products/:slug
 * @access  Public
 */
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

/**
 * @desc    Obtiene productos por una categoría (slug)
 * @route   GET /api/products/category/:categorySlug
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
  try {
    // 1. Obtener el slug usando el nombre del parámetro de la ruta ('slug')
    const { slug } = req.params;

    // 2. Filtrar por el campo 'category' en tu modelo de Producto.
    // Usamos $regex y 'i' para que la búsqueda sea insensible a mayúsculas/minúsculas.
    const products = await Product.find({
      category: { $regex: new RegExp(slug, "i") },
    });

    if (products.length === 0) {
      // Si no se encuentran productos, devolvemos un 404 informativo (opcional pero recomendado)
      return res
        .status(404)
        .json({ message: "No se encontraron productos para esta categoría." });
    }

    // Devuelve los productos encontrados
    res.json(products);
  } catch (error) {
    console.error(`Error al obtener productos por categoría: ${error.message}`);
    res
      .status(500)
      .json({
        message: "Error interno del servidor al filtrar productos.",
        error: error.message,
      });
  }
};

export { getProducts, getProductBySlug, getProductsByCategory };
