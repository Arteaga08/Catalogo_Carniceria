// src/components/layout/AdminLayout.jsx (VERSIÓN RESPONSIVA)
import React, { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { FaBars, FaTimes } from "react-icons/fa"; // 👈 Importar FaTimes para el botón de cerrar

const AdminLayout = () => {
  // 🎯 1. Estado para controlar la apertura del Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 2. OVERLAY OSCURO (Solo visible en móvil cuando el menú está abierto) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
        ></div>
      )}

      {/* 3. SIDEBAR RESPONSIVO (Oculto en móvil por defecto, visible en LG) */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 transform 
          bg-gray-800 text-white w-64 flex flex-col transition-transform duration-300 ease-in-out
          
          // Lógica Móvil: Muestra (translate-x-0) u Oculta (-translate-x-full)
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          
          // Lógica Desktop: Siempre visible en pantallas grandes (lg)
          lg:translate-x-0 lg:static lg:shadow-none 
        `}
      >
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          🥩 Admin Carnicería
          {/* Botón de Cierre (Solo visible en Sidebar en móvil) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 text-white lg:hidden"
          >
            <FaTimes className="w-6 h-6" />
          </button>
        </div>

        {/* Navegación (onClick para cerrar el menú en móvil al navegar) */}
        <nav className="grow p-4">
          <ul>
            {[
              { to: "/admin", label: "🏠 Dashboard" },
              { to: "/admin/products", label: "📦 Gestionar Productos" },
              { to: "/admin/categories", label: "🏷️ Gestionar Categorías" },
            ].map((item) => (
              <li key={item.to} className="mb-2">
                <Link
                  to={item.to}
                  onClick={() => setIsSidebarOpen(false)} // 👈 Cerrar al hacer clic
                  className="block p-2 rounded hover:bg-gray-700 transition duration-150"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Enlace de Cerrar Sesión */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => {
              handleLogout();
              setIsSidebarOpen(false);
            }}
            className="w-full text-left p-2 rounded hover:bg-red-600 transition duration-150"
          >
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* 4. CONTENIDO PRINCIPAL Y BOTÓN DE APERTURA EN MÓVIL */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Botón de Abrir Menú (Solo visible en móvil) */}
        <header className="p-4 bg-white border-b border-gray-200 lg:hidden flex justify-between items-center sticky top-0 z-30 shadow-md">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 hover:text-red-600 focus:outline-none"
          >
            <FaBars className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-bold text-gray-800">
            Panel de Administración
          </h2>
        </header>

        {/* Área de la Página (Dashboard, Productos, etc.) */}
        <main className="p-4 sm:p-6 lg:p-8">
          {" "}
          {/* 👈 Padding responsivo */}
          <Outlet /> {/* Aquí se renderizarán los componentes de ruta */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
