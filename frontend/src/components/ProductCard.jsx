import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartCotext";
import { getAbsoluteImageUrl } from "../api/apiService";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  // 1. Determinar la fuente del Precio/Unidad
  let priceSource = null;

  // 🟢 LÓGICA CORREGIDA: Priorizar los nuevos campos planos
  if (product.price && product.unitType) {
    // Si tiene campos planos (producto NUEVO/ACTUALIZADO)
    priceSource = {
      price: product.price,
      // Usamos unitType de la DB
      unitType: product.unitType,
      _id: product._id, // Usamos el ID del producto como ID de variación simple
    };
  } else if (product.variations && product.variations.length > 0) {
    // Si tiene el antiguo array de variaciones (producto ANTIGUO)
    const defaultVariation = product.variations[0];
    priceSource = {
      price: defaultVariation.price,
      // Usamos el antiguo unitName/unitReference como unitType (fallback)
      unitType:
        defaultVariation.unitName || defaultVariation.unitReference || "Unidad",
      _id: defaultVariation._id,
    };
  }

  // Si no hay datos de precio ni variación, no renderizamos la tarjeta (o mostramos un error)
  if (!priceSource) {
    console.error(`Producto sin precio o unidad válida: ${product.name}`);
    return null;
  }

  // 2. Definir variables para el Display
  // Usamos protección para evitar NaN en el display
  const priceDisplay = priceSource.price || 0;

  // 🟢 CLAVE: Lógica para abreviar 'kilogramo' a 'kg' en el display
  let unitDisplay = priceSource.unitType || "Unidad";
  if (unitDisplay === "kilogramo") {
    unitDisplay = "kg";
  }

  // 3. Handler para añadir el producto al carrito
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Cuando llamamos a addToCart, necesitamos pasar la información necesaria para el carrito.
    // Pasamos el priceSource, que ahora contiene el 'unitType' correcto.
    addToCart(product, priceSource, 1);
  };

  const imageUrl = getAbsoluteImageUrl(product.imageURL);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product.slug}`}>
        {/* Espacio para la imagen del producto */}
        <div className="h-48 overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        <div className="p-4 pb-2">
          {/* Categoría o Subcategoría */}
          <p className="text-xs font-semibold text-red-600 uppercase mb-1">
            {product.categorySlug || "General"}
          </p>

          {/* Nombre del Producto */}
          <h3 className="text-base font-bold text-gray-900 mb-2 whitespace-normal overflow-hidden h-10 leading-tight">
            {product.name}
          </h3>

          {/* Display del precio y unidad (AHORA CORRECTO) */}
          <p className="text-xl font-bold text-gray-800 mb-3">
            ${Number(priceDisplay).toFixed(2)} / {unitDisplay}
          </p>
        </div>
      </Link>

      {/* 4. Botón Añadir al Carrito (Fuera del Link para que sea clicable aquí) */}
      <div className="p-4 pt-0">
        <button
          onClick={handleAddToCart}
          className="cursor-pointer w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
        >
          <span className="text-xl mr-2">🛒</span>
          Añadir
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
