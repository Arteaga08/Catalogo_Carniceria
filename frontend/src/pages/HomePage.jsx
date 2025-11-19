import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchCategories } from "../api/apiService";

// 1. Importar el nuevo componente
import ProductCard from "../components/ProductCard";
import CategoryNavigator from "../components/CategoryNavigator"; // 👈 IMPORTAR

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado para cargar las categorías (Necesario para CategoryNavigator)
  const [groupedCategories, setGroupedCategories] = useState({}); // 👈 ESTADO DE CATEGORÍAS

  const { slug } = useParams(); // Puede ser null, o un slug de subcategoría

  // Efecto para cargar PRODUCTOS
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Cargar productos filtrados o todos
        const productsData = await fetchProducts(slug);
        setProducts(productsData || []);

        // 2. Cargar CATEGORÍAS (si no lo hace otro componente globalmente)
        const categoriesData = await fetchCategories();
        setGroupedCategories(categoriesData || {}); // 👈 CARGAR CATEGORÍAS
      } catch (err) {
        setError("Error al cargar los datos del catálogo.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  const pageTitle = slug
    ? `Categoría: ${slug.toUpperCase().replace(/-/g, " ")}`
    : "Nuestro Catálogo";
  const pageSubtitle = slug
    ? "Explora nuestros cortes frescos."
    : "La carne más fresca a tu mesa.";

  // Renderizado Condicional
  if (loading)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-xl text-red-700">
        Cargando catálogo...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Error: {error}
      </div>
    );

  return (
    <>
      {/* 3. Renderizar el navegador de categorías antes del catálogo */}
      <CategoryNavigator categories={groupedCategories} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-600">{pageSubtitle}</p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            No se encontraron productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default HomePage;
