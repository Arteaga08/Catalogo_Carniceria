import axios from 'axios';

// La URL base es solo '/api' porque configuramos el proxy en vite.config.js
// Esto se traduce automáticamente a http://localhost:5001/api en desarrollo.
const API_BASE_URL = '/api'; 

/**
 * @desc Obtiene todas las categorías agrupadas por categoryPrincipal.
 * @route GET /api/categories
 */
export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    // Devuelve los datos agrupados, listos para usar en el Header
    return response.data; 
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    return null;
  }
};

/**
 * @desc Obtiene todos los productos.
 * @route GET /api/products
 */
export const fetchAllProducts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener todos los productos:", error);
    return null;
  }
};

// Dejaremos aquí una función placeholder para el futuro
export const fetchProductsByCategory = async (categorySlug) => {
  // Cuando necesitemos filtrar por categoría: /api/products/category/slug-de-la-categoria
  try {
    const response = await axios.get(`${API_BASE_URL}/products/category/${categorySlug}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener productos de ${categorySlug}:`, error);
    return null;
  }
};