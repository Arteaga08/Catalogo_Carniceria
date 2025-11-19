// Archivo: frontend/src/api/apiService.js

// ... (asegúrate de que tu URL base sea correcta)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// 1. MODIFICAR fetchProducts para aceptar un slug de subcategoría opcional
export const fetchProducts = async (slug = null) => {
  try {
    let url = `${API_URL}/products`;

    if (slug) {
      url = `${API_URL}/products/category/${slug}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      // Manejamos el caso de que la API devuelva un error (ej. 404 si la categoría no existe)
      if (response.status === 404) {
        // Si no hay productos en la categoría, devolvemos un array vacío en lugar de lanzar error
        return [];
      }
      throw new Error(`Error al obtener productos: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error en fetchProducts:", error);
    throw error; // Propagar el error para que lo maneje el componente
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
