// Archivo: frontend/src/api/apiService.js
import axios from "axios";
// ... (asegúrate de que tu URL base sea correcta)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// 1. MODIFICAR fetchProducts para aceptar un slug de subcategoría opcional
export const fetchProducts = async (
  categorySlug = null,
  searchTerm = null,
  limit = null
) => {
  let url = "/api/products";
  const params = new URLSearchParams();

  // Lógica de filtrado por categoría
  if (categorySlug) {
    params.append("category", categorySlug);
  }

  // Lógica de filtrado por búsqueda
  if (searchTerm) {
    params.append("q", searchTerm);
  }

  // ✨ 2. NUEVA LÓGICA DE LÍMITE ✨
  if (limit) {
    params.append("limit", limit);
  }

  if (params.toString()) {
    url = `${url}?${params.toString()}`;
  }

  try {
    // Asegúrate de que 'axios' esté importado si aún no lo está
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// 2. fetchProductBySlug permanece igual
export const fetchProductBySlug = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`);

    if (!response.ok) {
      throw new Error(`Producto no encontrado: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchProductBySlug:", error);
    throw error;
  }
};

// 3. fetchCategories permanece igual
export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }

    const data = await response.json();
    return data; // Debería devolver el objeto de categorías agrupadas
  } catch (error) {
    console.error("Error en fetchCategories:", error);
    throw error;
  }
};

// 4. Nueva función para buscar productos por nombre o descripción
export const searchProducts = async (query) => {
  try {
    // Asegúrate de que esta URL apunta a tu ruta de backend de búsqueda
    const response = await fetch(`${API_URL}/products/search?q=${query}`);

    if (!response.ok) {
      throw new Error("Fallo al buscar productos");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en searchProducts:", error);
    return [];
  }
};
