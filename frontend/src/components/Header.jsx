import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { fetchCategories } from "../api/apiService";
import SideBar from "./SideBar";
import CategoryNavigator from "./CategoryNavigator";
import { useCart } from "../context/CartCotext";
import ImageCarousel from "./ImageCarousel";

const Header = () => {
  const [groupedCategories, setGroupedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedPrincipalFromSidebar, setSelectedPrincipalFromSidebar] =
    useState(null);
  const { cartCount } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  const location = useLocation();
  const currentPath = location.pathname;

  const isHomePage = currentPath === "/" && !location.search.includes("q=");

  const getActiveCategorySlug = () => {
    const match = currentPath.match(/\/products\/([^/]+)/);
    return match ? match[1] : null;
  };

  const activeSlug = getActiveCategorySlug();

  const navigate = useNavigate();

  // Carga de categorías
  useEffect(() => {
    const loadCategories = async () => {
      // Manejar el loading si es necesario, pero lo quitamos para no romper el flujo
      try {
        const data = await fetchCategories();
        if (data) {
          setGroupedCategories(data);
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  // Detector de Scroll para Sticky
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // El umbral (80px) es para que se active cuando la barra roja principal desaparece
      if (offset > 80) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Helpers y Handlers (simplificados para el contexto)
  const handleLinkClick = () => {
    setOpenDropdown(null);
    setIsSidebarOpen(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setIsSearchExpanded(false);
    } else {
      // Si el usuario borra la búsqueda y presiona enter, navegamos al inicio
      navigate("/");
    }
  };

  // Altura del espacio fantasma (ajustar si es necesario)
  // Calculamos la altura de la barra de categorías para evitar saltos.
  const phantomHeight = isSticky ? "115px" : "0";

  return (
    <>
      {/* DEFINICIÓN DE LA ANIMACIÓN SUAVE (Slide Down) */}
      <style>{`
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        /* La animación solo aplica si está en modo sticky */
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>

      {/* 1. HEADER PRINCIPAL (Barra Roja) */}
      {/* Esta barra debe ser relativa para que el carrusel se pueda colocar debajo */}
      <header className="bg-red-700 text-white shadow-lg relative z-40">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl p-2 rounded hover:bg-red-600 transition-colors mr-2 shrink-0"
          >
            ☰
          </button>

          <Link
            to="/"
            className={`text-2xl md:text-3xl font-extrabold tracking-tight hover:text-red-300 transition-colors flex-1 md:flex-none ${
              isSearchExpanded ? "hidden sm:block" : ""
            }`}
          >
            Carnicería Meño
          </Link>

          {/* Lógica de Búsqueda */}
          <div
            className={`flex items-center justify-end ${
              isSearchExpanded
                ? "w-full absolute left-0 pr-10"
                : "md:flex-1 md:max-w-lg"
            }`}
          >
            <form
              onSubmit={handleSearchSubmit}
              className={`flex transition-all duration-300 ${
                isSearchExpanded ? "flex-1 ml-4" : "hidden md:flex flex-1"
              }`}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar cortes..."
                className="w-full p-2 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-800"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-r-md transition-colors"
              >
                {/* SVG de Búsqueda */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </form>

            {/* Botones de expandir/colapsar búsqueda en móvil */}
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2 rounded hover:bg-red-600 transition-colors md:hidden ${
                isSearchExpanded ? "hidden" : "block"
              }`}
            >
              {/* SVG de Lupa */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            {isSearchExpanded && (
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchTerm("");
                }}
                className="p-2 rounded hover:bg-red-600 transition-colors md:hidden absolute right-4"
              >
                {/* SVG de Cerrar */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Icono de Carrito */}
          <div className={`shrink-0 ${isSearchExpanded ? "hidden" : "block"}`}>
            <Link
              to="/cart"
              className="text-xl hover:text-red-300 transition-colors ml-2 flex items-center whitespace-nowrap"
            >
              🛒 Carrito ({Math.floor(cartCount)})
            </Link>
          </div>
        </div>
      </header>

      {isHomePage && (
        <div className="w-full relative z-20">
          <ImageCarousel />
        </div>
      )}

      {/* 2. NAVEGACIÓN DE CATEGORÍAS (Se hace Sticky) */}
      <section
        className={`w-full transition-all duration-300 z-30 ${
          isSticky
            ? "fixed top-0 left-0 w-full z-50 animate-slide-down bg-white shadow-md" // ⬅️ Añadir background y sombra para cuando es sticky
            : "relative"
        }`}
        aria-hidden={isSticky ? "false" : "true"}
      >
        <CategoryNavigator
          categories={groupedCategories}
          activeSlug={activeSlug}
          isSidebarOpen={isSidebarOpen}
          selectedPrincipalFromSidebar={selectedPrincipalFromSidebar}
        />
      </section>

      {/* ⬅️ 3. CARRUSEL DE IMÁGENES (CONDICIONAL) */}
      {/* Se muestra solo en la página principal y no es sticky */}

      {/* Espacio Fantasma (mantener separación cuando la nav esté fija) */}
      {/* NOTA: Ajusta el valor de 'height' si la barra CategoryNavigator cambia de tamaño */}
      {isSticky && (
        <div className="w-full" style={{ height: phantomHeight }}></div>
      )}

      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={groupedCategories}
        handleLinkClick={handleLinkClick}
        onSelectPrincipalCategory={setSelectedPrincipalFromSidebar}
      />
    </>
  );
};

export default Header;
