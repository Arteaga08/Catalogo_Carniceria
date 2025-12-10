// Archivo: frontend/src/api/apiService.js
import axios from "axios";
// ... (asegúrate de que tu URL base sea correcta)
const API_BASE_URL_FILES =
  import.meta.env.VITE_API_BASE || "http://localhost:5001";
//const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
// 🟢 2. URL PARA PETICIONES DE LA API (con /api)
const API_URL = `${API_BASE_URL_FILES}/api`;

// 3. NUEVA FUNCIÓN DE UTILIDAD: Obtener URL absoluta de la imagen
export const getAbsoluteImageUrl = (relativePath) => {
  if (!relativePath) {
    return "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";
  }

  if (relativePath.startsWith("http")) {
    return relativePath; 
  }

  // Aseguramos que la ruta no comience con un '/' para evitar un doble slash (ej: //uploads/...)
  const cleanPath = relativePath.startsWith("/")
    ? relativePath.substring(1)
    : relativePath;

  // Concatenamos la URL base del servidor (ej: http://localhost:5001) con la ruta de la imagen (ej: uploads/products/...)
  return `${API_BASE_URL_FILES}/${cleanPath}`;
};

// 1. MODIFICAR fetchProducts para aceptar un slug de subcategoría opcional
export const fetchProducts = async (
  categorySlug = null,
  searchTerm = null,
  limit = null
) => {
  let url = `${API_URL}/products`;
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
    // 🟢 CORRECCIÓN: Usar axios.get en lugar de fetch.
    const response = await axios.get(`${API_URL}/categories`);

    // Al usar axios, el payload JSON está en response.data
    const data = response.data;

    console.log("Categorías cargadas:", data); // Descomenta temporalmente para verificar la estructura

    // Si tu backend devuelve las categorías anidadas, por ejemplo: { categories: [...] },
    // podrías necesitar retornar data.categories o aplanar aquí.
    // Por ahora, asumimos que devuelve el array directo.
    return data;
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
