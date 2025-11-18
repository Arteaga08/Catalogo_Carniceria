// Archivo: frontend/src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchCategories } from "../api/apiService";
import SideBar from "./SideBar";

const Header = () => {
  const [groupedCategories, setGroupedCategories] = useState({});
  const [loading, setLoading] = useState(true);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // NECESITAMOS LA IMAGEN DE LA CATEGORÍA PRINCIPAL
  // La API fetchCategories devuelve un objeto como:
  // {
  //   "CARNICERÍA": [{ _id: ..., name: "Res", slug: "res", imageURL: "..." }, ...],
  //   "PAQUETES": [{ _id: ..., name: "Familiar", slug: "familiar", imageURL: "..." }, ...]
  // }
  // Usaremos la imagen de la PRIMERA subcategoría como imagen representativa de la principal.
  const getPrincipalCategoryImage = (principalName) => {
    if (
      groupedCategories[principalName] &&
      groupedCategories[principalName].length > 0
    ) {
      return groupedCategories[principalName][0].imageURL;
    }
    return null; // Si no hay subcategorías o imagen
  };

  const handleDropdownToggle = (categoryName) => {
    setOpenDropdown(openDropdown === categoryName ? null : categoryName);
  };

  const handleLinkClick = () => {
    setOpenDropdown(null);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* 1. Header principal */}
      <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* BOTÓN DEL MENÚ LATERAL (IZQUIERDA) */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-2xl p-1 rounded hover:bg-red-600 transition-colors mr-2"
            aria-label="Abrir menú de categorías"
          >
            ☰
          </button>

          {/* Enlace al Home */}
          <Link
            to="/"
            className="text-2xl md:text-3xl font-extrabold tracking-tight hover:text-red-300 transition-colors grow md:flex-none"
          >
            🥩 Carnicería MERN
          </Link>

          {/* Sección de Carrito */}
          <div>
            <Link
              to="/cart"
              className="text-xl hover:text-red-300 transition-colors ml-2"
            >
              🛒 Carrito (0)
            </Link>
          </div>
        </div>

        {/* 2. Navegación de Categorías con IMAGEN CIRCULAR EN BOTÓN PRINCIPAL */}
        {/* Siempre visible, con scroll horizontal en móvil */}
        <nav className="bg-red-800 py-2">
          <div className="container mx-auto px-4">
            <div className="flex space-x-2 text-sm font-medium overflow-x-scroll pb-1">
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
                      {/* IMAGEN CIRCULAR DE LA CATEGORÍA PRINCIPAL */}
                      <img
                        src={
                          getPrincipalCategoryImage(principalName) ||
                          "https://via.placeholder.com/24?text=🥩"
                        }
                        alt={principalName}
                        className="w-6 h-6 object-cover rounded-full mr-2 border border-red-500" // Pequeña imagen circular
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
                    {openDropdown === principalName && (
                      <div className="absolute right-0 md:left-0 mt-2 py-2 w-80 bg-white rounded-md shadow-xl z-50">
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
