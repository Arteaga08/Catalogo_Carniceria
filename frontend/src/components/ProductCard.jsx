import React from "react";
import { Link } from "react-router-dom";

// El componente recibe un objeto 'product' como prop
const ProductCard = ({ product }) => {
  // Manejamos un placeholder si la imagen no existe
  const imageUrl =
    product.imageURL || "https://via.placeholder.com/300?text=No+Image";

  const baseVariation =
    product.variations && product.variations.length > 0
      ? product.variations[0]
      : null;

  const basePrice = baseVariation ? baseVariation.price : null;
  const unitReference = baseVariation ? baseVariation.unitReference : " ";

  const formatedPrice =
    basePrice !== null
      ? new Intl.NumberFormat("es-MX", {
          style: "currency",
          currency: "MXN",
        }).format(basePrice)
      : "N/A";

  const priceDisplay =
    basePrice !== null ? `${formatedPrice} / ${unitReference}` : "Consultar";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      {/* Enlace a la página de detalle del producto (usando el slug) */}
      <Link to={`/product/${product.slug}`}>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">
        {/* Categoría (Opcional, si quieres mostrarla) */}
        <p className="text-xs text-red-600 font-semibold uppercase mb-1">
          {product.categorySlug
            ? product.categorySlug.replace(/-/g, " ").toUpperCase()
            : "CARNE"}
        </p>

        {/* Nombre del Producto */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">
          <Link
            to={`/product/${product.slug}`}
            className="hover:text-red-700 transition-colors"
          >
            {product.name}
          </Link>
        </h3>

        {/* Precio */}
        <p className="text-2xl font-extrabold text-gray-800 mb-3">
          {priceDisplay}
        </p>

        {/* Botón de Agregar al Carrito (Funcionalidad Futura) */}
        <button
          className="w-full bg-red-700 text-white py-2 rounded-lg font-semibold hover:bg-red-800 transition-colors"
          onClick={() => console.log("Añadir al carrito:", product.name)}
        >
          🛒 Añadir
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
