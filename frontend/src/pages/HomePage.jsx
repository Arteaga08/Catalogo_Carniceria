// Archivo: frontend/src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // 👈 Importante
import { fetchAllProducts, fetchProductsByCategory } from '../api/apiService'; // 👈 Importa ambas
import ProductCard from '../components/ProductCard'; 

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams(); // 👈 Leemos el slug de la URL
  
  const pageTitle = slug 
    ? `Catálogo de ${slug.toUpperCase()}` 
    : 'Nuestro Catálogo';
  
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      let data = [];
      
      if (slug) {
        // Llama a la API de filtrado
        data = await fetchProductsByCategory(slug);
      } else {
        // Llama a la API de todos los productos
        data = await fetchAllProducts();
      }

      setProducts(data);
      setLoading(false);
    };

    loadProducts();
    // El efecto se ejecuta cuando 'slug' cambia (navegación)
  }, [slug]); 

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
        {pageTitle}
      </h2>
      <p className="text-xl text-gray-600 mb-8">
        La carne más fresca a tu mesa.
      </p>

      {/* ... (Renderizado condicional de loading/productos) ... */}

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : products.length === 0 ? (
        <p className="text-xl text-red-600 font-semibold">
          No se encontraron productos en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map(product => (
            <ProductCard key={product._id} product={product} /> 
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;