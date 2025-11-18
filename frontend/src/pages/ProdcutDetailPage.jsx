import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
// Asegúrate que esta importación apunte al archivo apiService.js correcto
import { fetchProductBySlug } from "../api/apiService";
// IMPORTANTE: Descomenta esta línea cuando el archivo CartContext.jsx exista
// import { useCart } from '../context/CartContext';

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para manejar la cantidad seleccionada (por defecto 1.0 Kg)
  const [quantity, setQuantity] = useState(1.0);

  // 1. Obtenemos el slug de la URL
  const { slug } = useParams();

  // 2. Obtenemos la función para añadir al carrito (Descomentar en el siguiente paso)
  // const { addToCart } = useCart();

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
          setProduct(data);
          console.log("Producto cargado con éxito:", data.name);
        } else {
          setError("El producto no existe o la respuesta fue vacía.");
        }
      } catch (err) {
        console.error("Fallo al cargar el producto:", err);
        setError("Error de red o del servidor al obtener el producto.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    // 1. Obtener el precio y verificar la cantidad
    if (!product || quantity < 0.5) {
      alert("Por favor, selecciona una cantidad válida (mínimo 0.5 Kg).");
      return;
    }

    // 2. Lógica del Contexto (Se descomenta y usa en el siguiente paso)
    // addToCart(product, quantity);

    alert(
      `¡Listo para agregar ${quantity.toFixed(1)} Kg de ${
        product.name
      } al carrito!`
    );
  };

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

  // --- Variables para renderizado (Compatibilidad con diferentes esquemas de DB) ---
  const imageUrl =
    product.imageURL ||
    "https://via.placeholder.com/600x400?text=Imagen+No+Disponible";

  const displayCategory =
    product.category || product.categorySlug || "Categoría";

  // Usar el campo price o buscar en variations si price no existe
  const displayPrice =
    product.price ||
    (Array.isArray(product.variations) && product.variations[0]?.price) ||
    null;

  const totalEstimado = displayPrice ? displayPrice * quantity : 0;

  // --- Renderizado del Detalle del Producto (si product existe) ---

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

            <p className="text-3xl font-black text-gray-800 mb-2">
              Precio:{" "}
              {displayPrice ? `$${Number(displayPrice).toFixed(2)}` : "N/A"}
              <span className="text-base font-normal text-gray-500"> / Kg</span>
            </p>

            <hr className="my-6" />

            {/* Selector de Cantidad (Kg) */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Seleccionar Cantidad
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <input
                type="number"
                value={quantity.toFixed(1)} // Mostrar con un decimal
                onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setQuantity(Math.max(0.5, isNaN(value) ? 0.5 : value)); // Mínimo 0.5 Kg
                }}
                min="0.5"
                step="0.5"
                className="w-24 text-center border-2 border-gray-300 rounded-lg p-3 text-xl font-semibold focus:border-red-500 focus:outline-none"
                disabled={displayPrice === null}
              />
              <span className="text-xl text-gray-700 font-semibold">Kg</span>
            </div>

            {/* Costo Total Estimado */}
            <p className="text-3xl font-black text-red-700 mb-8">
              Total: ${totalEstimado.toFixed(2)}
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
              className="w-full md:w-auto bg-red-700 text-white text-xl py-3 px-8 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg disabled:bg-gray-400"
              onClick={handleAddToCart}
              disabled={displayPrice === null || quantity < 0.5}
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
