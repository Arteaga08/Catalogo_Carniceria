// Archivo: frontend/src/pages/HomePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAllProducts } from "../api/apiService";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      const data = await fetchAllProducts();
      if (data) {
        setProducts(data);
      }
      setLoading(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">
        Nuestro Catálogo
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        La carne más fresca a tu mesa.
      </p>

      {/* Indicador de carga */}
      {loading && <p className="text-gray-500">Cargando productos...</p>}

      {/* Listado de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.slug}
            className="border p-4 rounded-lg shadow-xl bg-white hover:shadow-2xl transition-shadow duration-300"
          >
            {/* Imagen del producto (Usamos un placeholder si no hay URL) */}
            <img
              src={product.imageURL || "https://via.placeholder.com/150"}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />

            {/* Nombre y precio */}
            <h2 className="text-xl font-semibold text-red-600 truncate">
              {product.name}
            </h2>

            {/* Precio de la primera variación */}
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${product.variations[0]?.price.toFixed(2) || "N/A"}
            </p>

            {/* Enlace para ver detalles */}
            <Link
              to={`/products/${product.slug}`}
              className="mt-3 inline-block bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Ver Detalle
            </Link>
          </div>
        ))}

        {/* Mensaje si no hay productos */}
        {!loading && products.length === 0 && (
          <p className="text-red-500 col-span-full">
            No se encontraron productos.
          </p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
