import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { fetchProducts, searchProducts } from "../api/apiService";
import ProductCard from "../components/ProductCard";
// NOTA: ImageCarousel ya NO se importa aquí porque se movió a Header.jsx

// Hook para obtener los parámetros de búsqueda de la URL
const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = useQuery();
  const searchTerm = query.get("q");
  const { slug: categorySlug } = useParams();
  // Limita los productos solo si estás en la página principal (/) y no buscando.
  const productLimit = categorySlug || searchTerm ? null : 6;

  // Efecto para cargar PRODUCTOS
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        let productsData;

        if (searchTerm) {
          productsData = await searchProducts(searchTerm);
        } else {
          productsData = await fetchProducts(categorySlug, null, productLimit);
        }

        setProducts(productsData || []);
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
  }, [categorySlug, searchTerm, productLimit]);

  // --- Lógica para títulos dinámicos ---
  let pageTitle;
  let pageSubtitle;

  const currentSlug = categorySlug;

  if (searchTerm) {
    pageTitle = `Resultados para: "${searchTerm}"`;
    pageSubtitle = `Se encontraron ${products.length} productos.`;
  } else if (currentSlug) {
    pageTitle = `${currentSlug.toUpperCase().replace(/-/g, " ")}`;
    pageSubtitle = "Explora nuestros cortes frescos.";
  } else {
    // Muestra el titulo Principal y subtitulo
    pageTitle = productLimit
      ? "Nuestros Productos Destacados"
      : "Nuestro Catálogo";
    pageSubtitle = "La carne más fresca a tu mesa.";
  }

  const noProductsMessage = searchTerm
    ? `No se encontraron resultados para la búsqueda "${searchTerm}".`
    : `No se encontraron productos en ${
        currentSlug ? currentSlug.replace(/-/g, " ") : "esta sección"
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
    <div className="min-h-screen">
      {/* 🛑 AQUÍ YA NO ESTÁ EL CARRUSEL, SE MUESTRA DESDE EL HEADER */}

      <div className="container mx-auto px-4 py-8">
        {/* TÍTULO DE LA PÁGINA */}
        <div className="text-center mb-10 w-full max-w-4xl mx-auto px-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2 whitespace-normal">
            {pageTitle}
          </h1>
          <p className="text-xl text-gray-600 whitespace-normal">
            {pageSubtitle}
          </p>
        </div>

        {/* LISTA DE PRODUCTOS */}
        {products.length === 0 ? (
          <p className="text-center text-xl text-gray-500 py-10">
            {noProductsMessage}
          </p>
        ) : (
          // CENTRADO DEL GRID DE PRODUCTOS
          <div className="flex justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
