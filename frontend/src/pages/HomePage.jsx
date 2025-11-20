import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
// Asegúrate de importar searchProducts
import {
  fetchProducts,
  fetchCategories,
  searchProducts,
} from "../api/apiService";
import ProductCard from "../components/ProductCard";
import CategoryNavigator from "../components/CategoryNavigator";

// Hook para obtener los parámetros de búsqueda de la URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const HomePage = () => {
  const query = useQuery();
  const searchTerm = query.get("q"); // 👈 OBTENER EL TÉRMINO DE BÚSQUEDA
  const { slug } = useParams(); // Para filtro por categoría

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [groupedCategories, setGroupedCategories] = useState({});

  // Efecto para cargar PRODUCTOS y CATEGORÍAS
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let productsData;

        // 1. LÓGICA CONDICIONAL DE CARGA DE PRODUCTOS
        if (searchTerm) {
          // A. Si hay término de búsqueda, usamos searchProducts
          productsData = await searchProducts(searchTerm);
        } else {
          // B. Si no, usamos fetchProducts (filtro por slug o todos)
          productsData = await fetchProducts(slug);
        }

        setProducts(productsData || []);

        // 2. Cargar CATEGORÍAS (Siempre cargamos categorías para el CategoryNavigator)
        const categoriesData = await fetchCategories();
        setGroupedCategories(categoriesData || {});
      } catch (err) {
        console.error("Error al cargar datos en HomePage:", err);
        setError(
          "Error al cargar los datos del catálogo o resultados de búsqueda."
        );
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Añadimos 'searchTerm' como dependencia para que el componente se recargue
    // y ejecute la búsqueda cada vez que la URL cambia por una búsqueda.
  }, [slug, searchTerm]); // 👈 DEPENDENCIA AÑADIDA

  // --- Lógica para títulos dinámicos ---

  let pageTitle;
  let pageSubtitle;

  if (searchTerm) {
    pageTitle = `Resultados para: "${searchTerm}"`;
    pageSubtitle = `Se encontraron ${products.length} productos.`;
  } else if (slug) {
    pageTitle = `Categoría: ${slug.toUpperCase().replace(/-/g, " ")}`;
    pageSubtitle = "Explora nuestros cortes frescos.";
  } else {
    pageTitle = "Nuestro Catálogo";
    pageSubtitle = "La carne más fresca a tu mesa.";
  }

  const noProductsMessage = searchTerm
    ? `No se encontraron resultados para la búsqueda "${searchTerm}".`
    : `No se encontraron productos en ${
        slug ? slug.replace(/-/g, " ") : "esta sección"
      }.`;

  // --- Renderizado Condicional ---

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
      {/* 1. Category Navigator: Solo renderizar si NO estamos en modo búsqueda */}
      {!searchTerm && (
        <section className="mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">
            Explora por Sección
          </h2>
          <CategoryNavigator categories={groupedCategories} />
        </section>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-600">{pageSubtitle}</p>
        </div>

        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            {noProductsMessage}
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
