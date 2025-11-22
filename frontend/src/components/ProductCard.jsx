import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartCotext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // 1. Determinar la variación por defecto
  // Usaremos la primera variación disponible. Si no hay, verificamos si hay un precio base simple.
  let defaultVariation = null;

  if (product.variations && product.variations.length > 0) {
    defaultVariation = product.variations[0];
  } else if (product.price) {
    // Si no hay array de variaciones pero sí hay precio, creamos un objeto simple temporal
    defaultVariation = {
      price: product.price,
      unitLabel: "Unidad",
      _id: product._id, // Usamos el ID del producto como ID de variación simple
    };
  }

  // Si no hay datos de precio ni variación, no renderizamos la tarjeta (o mostramos un error)
  if (!defaultVariation) {
    console.error(`Producto sin precio o variación definida: ${product.name}`);
    return null;
  }

  // 2. Definir variables para el Display
  const priceDisplay = defaultVariation.price || 0;
  const unitDisplay =
    defaultVariation.unitLabel || defaultVariation.unitReference || "Unidad";

  // 3. Handler para añadir el producto al carrito
  const handleAddToCart = (e) => {
    // Detiene la propagación del evento para que NO se active el <Link> padre.
    e.preventDefault();
    e.stopPropagation();

    // Llamamos a addToCart con el producto, la variación por defecto y la cantidad (1)
    // El CartContext ya sabe cómo usar el 'defaultVariation' para crear el lineItemId
    addToCart(product, defaultVariation, 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* 🔴 El enlace envuelve toda la tarjeta excepto el botón para permitir navegación al detalle */}
      <Link to={`/products/${product.slug}`}>
        {/* Espacio para la imagen del producto */}
        <div className="h-48 overflow-hidden">
          <img
            src={
              product.imageURL ||
              "https://via.placeholder.com/400x300?text=Corte"
            }
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="p-4 pb-2">
          {/* Categoría o Subcategoría */}
          <p className="text-xs font-semibold text-red-600 uppercase mb-1">
            {product.category || "General"}
          </p>

          {/* Nombre del Producto */}
          <h3 className="text-base font-bold text-gray-900 mb-2 whitespace-normal overflow-hidden h-10 leading-tight">
            {product.name}
          </h3>

          {/* Display del precio y unidad */}
          <p className="text-xl font-bold text-gray-800 mb-3">
            ${Number(priceDisplay).toFixed(2)} / {unitDisplay}
          </p>
        </div>
      </Link>

      {/* 4. Botón Añadir al Carrito (Fuera del Link para que sea clicable aquí) */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
        >
          <span className="text-xl mr-2">🛒</span>
          Añadir
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
