// Archivo: frontend/src/components/SideBar.jsx (¡Asegúrate que el nombre de archivo sea SideBar.jsx!)

import React, { useState } from "react"; // 👈 Necesita useState
import { Link } from "react-router-dom";

// El nombre de la función componente DEBE coincidir con el nombre del archivo
const SideBar = ({ isOpen, onClose, categories, handleLinkClick }) => {
  // Estado para controlar qué categoría principal está abierta (estilo acordeón)
  const [openCategory, setOpenCategory] = useState(null);

  const principalCategories = Object.keys(categories);

  const toggleCategory = (categoryName) => {
    // Si la categoría ya está abierta, la cierra (null). Si está cerrada, la abre.
    setOpenCategory(openCategory === categoryName ? null : categoryName);
  };

  return (
    <>
      {/* Overlay Oscuro */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Menú Lateral (Sidebar) */}
      <div
        className={`fixed top-0 left-0 h-full w-11/12 sm:w-64 bg-white shadow-2xl z-50 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Encabezado del Sidebar */}
        <div className="p-4 bg-red-700 text-white flex justify-between items-center">
          <h3 className="text-xl font-bold">Menú de Carnes</h3>
          <button
            onClick={onClose}
            className="text-2xl hover:text-red-300 transition-colors"
          >
            &times; {/* Icono de cerrar */}
          </button>
        </div>

        {/* Contenido del Sidebar (Lista de categorías con Acordeón) */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          {/* Enlace al Inicio */}
          <Link
            to="/"
            onClick={() => {
              handleLinkClick();
              onClose();
            }}
            className="block text-xl font-extrabold text-gray-900 py-3 border-b-2 border-gray-100 hover:text-red-700 transition-colors"
          >
            INICIO
          </Link>

          {principalCategories.map((principalName) => (
            <div key={principalName} className="border-b border-gray-200">
              {/* Botón de Categoría Principal (Trigger del Acordeón) */}
              <button
                onClick={() => toggleCategory(principalName)} // 👈 Lógica del acordeón
                className="w-full py-3 text-xl font-extrabold text-left text-gray-900 flex justify-between items-center hover:text-red-700 transition-colors"
              >
                {principalName}
                {/* Icono + o - */}
                <span className="text-xl font-normal">
                  {openCategory === principalName ? "–" : "+"}
                </span>
              </button>

              {/* Contenedor de Subcategorías (Se despliega/colapsa) */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out 
                ${
                  openCategory === principalName
                    ? "max-h-96 opacity-100 pb-2"
                    : "max-h-0 opacity-0"
                }`}
              >
                <ul className="space-y-1 pl-4">
                  {/* Mapea las subcategorías */}
                  {categories[principalName].map((subCategory) => (
                    <li key={subCategory.slug}>
                      <Link
                        to={`/products/category/${subCategory.slug}`}
                        onClick={handleLinkClick}
                        className="flex items-center text-sm text-gray-700 hover:bg-red-50 p-2 rounded transition-colors"
                      >
                        <img
                          src={
                            subCategory.imageURL ||
                            "https://via.placeholder.com/24?text=🥩"
                          }
                          alt={subCategory.name}
                          className="w-6 h-6 object-cover rounded mr-2"
                        />
                        {subCategory.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// El nombre de exportación DEBE coincidir con el nombre de archivo/función
export default SideBar;
