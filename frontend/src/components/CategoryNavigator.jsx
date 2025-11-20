import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { fetchCategories } from "../api/apiService";
import SideBar from "./SideBar";
import { useCart } from "../context/CartCotext";
// 👈 IMPORTAR EL COMPONENTE CategoryNavigator AQUÍ
import CategoryNavigator from "../pages/CategoryNavigator"; // Asegúrate de ajustar la ruta si no está en pages

const Header = () => {
  const [groupedCategories, setGroupedCategories] = useState({});
  // ... (resto de estados) ...
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const navigate = useNavigate();

  // Lógica de carga de categorías
  useEffect(() => {
    // ... (Lógica de carga de categorías sin cambios) ...
  }, []);

  // ... (resto de funciones sin cambios) ...

  return (
    <>
      {/* 1. Header principal */}
      <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
        // ... (Contenido del header principal sin cambios) ...
      </header>

      {/* 2. NUEVA SECCIÓN DE NAVEGACIÓN DE CATEGORÍAS (CÍRCULOS) */}
      {/* Usamos una sección blanca para que los círculos se vean bien */}
      <section className="bg-white shadow-md py-4 w-full sticky top-16 z-40">
        <div className="container mx-auto px-4">
          {/* Centrado y Deslizamiento Horizontal */}
          {loading ? (
            <div className="text-center text-gray-500">
              Cargando categorías...
            </div>
          ) : (
            <div className="w-full flex justify-center items-center overflow-x-auto pb-2">
              {/* El componente CategoryNavigator espera 'categories' */}
              <CategoryNavigator categories={groupedCategories} />
            </div>
          )}
        </div>
      </section>

      {/* 3. Componente Sidebar (Menú Lateral) */}
      <SideBar
      // ... (props sin cambios) ...
      />
    </>
  );
};

export default Header;
