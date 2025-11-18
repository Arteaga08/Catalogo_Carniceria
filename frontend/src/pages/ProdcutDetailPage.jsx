// Archivo: frontend/src/pages/ProductDetailPage.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Asegúrate que esta importación apunte al archivo apiService.js correcto
import { fetchProductBySlug } from "../api/apiService";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Obtenemos el slug de la URL
  const { slug } = useParams();

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setError("Slug de producto no encontrado en la URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // 2. Llamada a la API
        const data = await fetchProductBySlug(slug);

        if (data && data.name) {
          // Verificamos que los datos sean válidos (ej: tiene nombre)
          setProduct(data);
          console.log("Producto cargado con éxito:", data.name);
        } else {
          setError("El producto no existe o la respuesta fue vacía.");
        }
      } catch (err) {
        console.error("Fallo al cargar el producto:", err);
        setError("Error de red o del servidor al obtener el producto.");
      } finally {
        // 3. Importante: Aseguramos que el estado de carga siempre termine
        setLoading(false);
      }
    };

    loadProduct();
    // Dependencia del efecto en el slug
  }, [slug]);

  // --- Renderizado Condicional ---

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-red-700">
          Cargando detalles del producto...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-red-600">
          Error: {error || "No se pudo cargar la información del producto."}
        </p>
        <p className="text-gray-500">
          Intenta navegar desde la página principal.
        </p>
      </div>
    );
  }

  // --- Renderizado del Detalle del Producto (si product existe) ---
  const imageUrl =
    product.imageURL ||
    "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";

  // Compatibilidad con el esquema de backend: algunos productos guardan la categoría
  // en `categorySlug` y el precio dentro de `variations`.
  const displayCategory = product.category || product.categorySlug || "Categoría";
  const displayPrice =
    product.price || (Array.isArray(product.variations) && product.variations[0]?.price) || null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Columna de Imagen */}
          <div className="md:w-1/2 p-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Columna de Detalle */}
          <div className="md:w-1/2 p-6 md:p-10">
            <span className="text-sm font-bold uppercase text-red-600 bg-red-100 px-3 py-1 rounded-full">
              {displayCategory}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-black text-gray-800 mb-6">
              {displayPrice ? `$${Number(displayPrice).toFixed(2)}` : "N/A"}
              <span className="text-base font-normal text-gray-500"> / Kg</span>
            </p>

            {/* Descripción */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Descripción
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description ||
                "Este producto no tiene una descripción detallada disponible."}
            </p>

            {/* Botón de Añadir al Carrito */}
            <button
              className="w-full md:w-auto bg-red-700 text-white text-xl py-3 px-8 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg"
              onClick={() => console.log("Añadir al carrito:", product.name)}
            >
              🛒 Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
