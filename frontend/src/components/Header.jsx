// Archivo: frontend/src/components/Header.jsx

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../api/apiService";
import SideBar from "./SideBar";
import { useCart } from "../context/CartCotext";

const Header = () => {
  const [groupedCategories, setGroupedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cartCount } = useCart();

  // ESTADOS DE BÚSQUEDA
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  // ... (Lógica de carga de categorías y helpers) ...
  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchCategories();
      if (data) {
        setGroupedCategories(data);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  const principalCategories = Object.keys(groupedCategories);

  const getPrincipalCategoryImage = (principalName) => {
    if (
      groupedCategories[principalName] &&
      groupedCategories[principalName].length > 0
    ) {
      return groupedCategories[principalName][0].imageURL;
    }
    return null;
  };

  const handleDropdownToggle = (categoryName) => {
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

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
      navigate("/");
    }
  };

  return (
    <>
      {/* 1. Header principal */}
      <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center relative">
          {/* BOTÓN DEL MENÚ LATERAL (IZQUIERDA) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-3xl p-2 rounded hover:bg-red-600 transition-colors mr-2 shrink-0"
            aria-label="Abrir menú de categorías"
          >
            ☰
          </button>

          {/* Enlace al Home */}
          {/* CORRECCIÓN 1.1: Agregamos flex-1 al logo para que use el espacio restante en móvil 
             cuando la búsqueda no está expandida, evitando que el carrito se comprima. */}
          <Link
            to="/"
            className={`text-2xl md:text-3xl font-extrabold tracking-tight hover:text-red-300 transition-colors flex-1 md:flex-none ${
              isSearchExpanded ? "hidden sm:block" : ""
            }`}
          >
            🥩 Carniceria
          </Link>

          {/* CONTENEDOR DE BÚSQUEDA */}
          {/* CORRECCIÓN 1.2: Quitamos la clase 'flex-1' cuando la búsqueda no está expandida en móvil. 
             Solo dejamos que se comporte como un contenedor normal para el ícono. */}
          <div
            className={`flex items-center justify-end ${
              isSearchExpanded
                ? "w-full absolute left-0 pr-10"
                : "md:flex-1 md:max-w-lg"
            }`}
          >
            {/* FORMULARIO DE BÚSQUEDA */}
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
                placeholder="Buscar cortes o paquetes..."
                className="w-full p-2 rounded-l-md border-none focus:outline-none focus:ring-2 focus:ring-red-500 bg-white text-gray-800"
              />
              <button
                type="submit"
                className="bg-red-500 hover:bg-red-600 p-2 text-white rounded-r-md transition-colors"
                aria-label="Buscar producto"
              >
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

            {/* BOTÓN DE LUPA */}
            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2 rounded hover:bg-red-600 transition-colors md:hidden ${
                isSearchExpanded ? "hidden" : "block"
              }`}
              aria-label="Expandir búsqueda"
            >
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

            {/* BOTÓN DE CERRAR (X) */}
            {isSearchExpanded && (
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchTerm("");
                }}
                className="p-2 rounded hover:bg-red-600 transition-colors md:hidden absolute right-4"
                aria-label="Cerrar búsqueda"
              >
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

          {/* Sección de Carrito */}
          <div className={`shrink-0 ${isSearchExpanded ? "hidden" : "block"}`}>
            <Link
              to="/cart"
              className="text-xl hover:text-red-300 transition-colors ml-2 flex items-center whitespace-nowrap"
            >
              🛒 Carrito ({Math.floor(cartCount)})
            </Link>
          </div>
        </div>

        {/* 2. Navegación de Categorías con Dropdowns */}
        <nav className="bg-red-800 py-2">
          <div className="container mx-auto px-4">
            <div className="flex space-x-2 text-sm font-medium overflow-x-auto pb-1 max-w-full">
              {loading ? (
                <span className="opacity-70 whitespace-nowrap">
                  Cargando categorías...
                </span>
              ) : (
                principalCategories.map((principalName) => (
                  <div
                    key={principalName}
                    className="relative group shrink-0"
                    onMouseEnter={() => setOpenDropdown(principalName)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      className="px-3 py-1 rounded-full bg-red-700 hover:bg-red-600 transition-colors whitespace-nowrap flex items-center"
                      onClick={() => handleDropdownToggle(principalName)}
                    >
                      <img
                        src={
                          getPrincipalCategoryImage(principalName) ||
                          "https://via.placeholder.com/24?text=🥩"
                        }
                        alt={principalName}
                        className="w-6 h-6 object-cover rounded-full mr-2 border border-red-500"
                      />
                      {principalName}
                      <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>

                    {/* MENÚ DESPLEGABLE (SUBMENÚ) con Imágenes Circulares */}
                    {/* CORRECCIÓN 2: Eliminamos 'hidden md:block' para que el dropdown sea visible en móvil al hacer clic */}
                    {openDropdown === principalName && (
                      <div className="absolute right-0 md:left-0 mt-2 py-2 md:w-80 w-auto max-w-[90vw] bg-white rounded-md shadow-xl z-50">
                        {groupedCategories[principalName].map((subCategory) => (
                          <Link
                            key={subCategory.slug}
                            to={`/products/category/${subCategory.slug}`}
                            onClick={handleLinkClick}
                            className="flex items-center p-3 text-sm text-gray-700 hover:bg-red-100 hover:text-red-700 transition-colors border-b last:border-b-0"
                          >
                            <img
                              src={
                                subCategory.imageURL ||
                                "https://via.placeholder.com/40?text=🥩"
                              }
                              alt={subCategory.name}
                              className="w-10 h-10 object-cover rounded-full mr-4 border border-gray-200"
                            />
                            <span className="font-medium">
                              {subCategory.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* 3. Componente Sidebar (Menú Lateral) */}
      <SideBar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        categories={groupedCategories}
        handleLinkClick={handleLinkClick}
      />
    </>
  );
};

export default Header;
