// Archivo: backend/controllers/productController.js

import Product from "../models/ProductModel.js"; // Asegúrate que el nombre del modelo sea correcto

/**
 * @desc    Obtiene todos los productos
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = async (req, res) => {
  const { category: categorySlug, q, limit } = req.query;

  try {
    let query = {};

    if (categorySlug) {
      query.categorySlug = categorySlug;
    }
    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    let mongooseQuery = Product.find(query);
    if (limit) {
      const numLimit = parseInt(limit, 10);

      if (!isNaN(numLimit) && numLimit > 0) {
        mongooseQuery = mongooseQuery.limit(numLimit);
      }
    }

    const products = await mongooseQuery;

    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
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
    const { slug } = req.params;

    const products = await Product.find({
      category: { $regex: new RegExp(slug, "i") },
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos para esta categoría." });
    }

    res.json(products);
  } catch (error) {
    console.error(`Error al obtener productos por categoría: ${error.message}`);
    res.status(500).json({
      message: "Error interno del servidor al filtrar productos.",
      error: error.message,
    });
  }
};

/**
 * @desc    Busca productos por nombre o descripción
 * @route   GET /api/products/search?q=query
 * @access  Public
 */
const searchProducts = async (req, res) => {
  try {
    // 1. Capturar el término de búsqueda de los query parameters (?q=...)
    const keyword = req.query.q
      ? {
          // Usamos $or para buscar en múltiples campos
          $or: [
            {
              // $regex permite buscar coincidencias parciales. 'i' hace que sea case-insensitive.
              name: { $regex: req.query.q, $options: "i" },
            },
            {
              description: { $regex: req.query.q, $options: "i" },
            },
          ],
        }
      : {}; // Si no hay query, devolvemos un objeto vacío para evitar errores (aunque el frontend debe enviar 'q')

    // 2. Ejecutar la búsqueda en la base de datos
    const products = await Product.find({ ...keyword });

    // 3. Devolver los resultados
    res.json(products);
  } catch (error) {
    console.error(`Error en la búsqueda de productos: ${error.message}`);
    res.status(500).json({
      message: "Error interno del servidor durante la búsqueda.",
      error: error.message,
    });
  }
};

export { getProducts, getProductBySlug, getProductsByCategory, searchProducts };
