// Archivo: backend/controllers/productController.js

import Product from '../models/ProductModel.js'; // Asegúrate que el nombre del modelo sea correcto

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
        res.status(500).json({ message: 'Error fetching products', error: error.message });
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
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error.message });
    }
};


/**
 * @desc    Obtiene productos por una categoría (slug)
 * @route   GET /api/products/category/:categorySlug
 * @access  Public
 */
const getProductsByCategory = async (req, res) => {
    try {
        // Filtra por el categorySlug provisto en la URL
        const products = await Product.find({ categorySlug: req.params.categorySlug });

        // Devuelve una lista vacía si no hay productos
        res.json(products); 
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by category', error: error.message });
    }
};

export { getProducts, getProductBySlug, getProductsByCategory };