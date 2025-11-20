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

  const [searchTerm, setSearchTerm] = useState("");
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);

  const [isSticky, setIsSticky] = useState(false);

  const navigate = useNavigate();

  // Carga de categorías
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

  // Detector de Scroll para Sticky
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      // Ajustamos el umbral un poco más alto para que la transición ocurra justo cuando desaparece el header rojo
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

  // Helpers y Handlers (sin cambios)
  const principalCategories = Object.keys(groupedCategories);

  const getPrincipalCategoryImage = (principalName) => {
    if (groupedCategories[principalName]?.length > 0) {
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
        .animate-slide-down {
          animation: slideDown 0.4s ease-out forwards;
        }
      `}</style>

      {/* 1. HEADER PRINCIPAL */}
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
            🥩 Carnicería MERN
          </Link>

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

            <button
              onClick={() => setIsSearchExpanded(true)}
              className={`p-2 rounded hover:bg-red-600 transition-colors md:hidden ${
                isSearchExpanded ? "hidden" : "block"
              }`}
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

            {isSearchExpanded && (
              <button
                onClick={() => {
                  setIsSearchExpanded(false);
                  setSearchTerm("");
                }}
                className="p-2 rounded hover:bg-red-600 transition-colors md:hidden absolute right-4"
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

      {/* 2. NAVEGACIÓN DE CATEGORÍAS CON ANIMACIÓN SUAVE */}
      <nav
        className={`bg-red-800 py-3 md:py-2 shadow-inner z-50 transition-all duration-300 ${
          // Añadimos 'animate-slide-down' cuando se activa el sticky
          isSticky
            ? "fixed top-0 left-0 w-full shadow-2xl animate-slide-down"
            : "relative"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex md:flex-wrap gap-4 md:gap-2 overflow-x-auto pb-2 md:pb-0 justify-start md:justify-center scrollbar-hide">
            {loading ? (
              <span className="opacity-70 whitespace-nowrap text-white">
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
                    className="flex flex-col md:flex-row items-center justify-center md:px-3 md:py-1 md:rounded-full md:bg-red-700 md:hover:bg-red-600 transition-all text-white"
                    onClick={() => handleDropdownToggle(principalName)}
                  >
                    <img
                      src={
                        getPrincipalCategoryImage(principalName) ||
                        "https://via.placeholder.com/40?text=🥩"
                      }
                      alt={principalName}
                      className="w-14 h-14 md:w-6 md:h-6 object-cover rounded-full border-2 border-white md:border-red-500 mb-1 md:mb-0 md:mr-2 shadow-md md:shadow-none transition-transform hover:scale-105"
                    />
                    <span className="text-xs md:text-sm font-semibold whitespace-nowrap">
                      {principalName}
                    </span>
                    <svg
                      className="w-4 h-4 ml-1 hidden md:block"
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

                  {openDropdown === principalName && (
                    <div className="absolute left-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-50 hidden md:block">
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
                              "https://via.placeholder.com/40"
                            }
                            alt={subCategory.name}
                            className="w-8 h-8 object-cover rounded-full mr-3"
                          />
                          {subCategory.name}
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

      {/* Espacio Fantasma */}
      {isSticky && <div className="w-full" style={{ height: "115px" }}></div>}

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
