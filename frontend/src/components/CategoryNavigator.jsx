// Archivo: frontend/src/components/CategoryNavigator.jsx

import React from "react";
import { Link } from "react-router-dom";

const CategoryNavigator = ({ categories }) => {
  // categories es el objeto agrupado: { "CARNICERÍA": [ {slug, name, imageURL}, ... ], ... }
  const principalCategories = Object.keys(categories);

  if (principalCategories.length === 0) {
    return null; // No renderizar si no hay categorías
  }

  // Función para obtener la imagen de la primera subcategoría como representación del grupo principal.
  const getPrincipalCategoryImage = (principalName) => {
    // Tomamos la imagen de la primera subcategoría del grupo
    const firstSubCategory = categories[principalName][0];
    return firstSubCategory ? firstSubCategory.imageURL : null;
  };

  return (
    <div className="bg-white py-4 shadow-inner">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Nuestro Catálogo
        </h2>

        {/* Contenedor principal con scroll horizontal y sin envoltura (flex-nowrap) */}
        <div className="flex space-x-4 overflow-x-scroll pb-2 whitespace-nowrap scrollbar-hide max-w-full">
          {principalCategories.map((principalName) => {
            const imageUrl = getPrincipalCategoryImage(principalName);

            // Enlace que dirige a la primera subcategoría del grupo principal
            const linkSlug = categories[principalName][0]?.slug;

            return (
              <Link
                key={principalName}
                // Usamos la ruta de filtrado de productos por categoría
                to={`/products/category/${linkSlug}`}
                className="flex flex-col items-center justify-start w-28 md:w-36 lg:w-40 shrink-0 p-2 rounded-lg hover:bg-red-50 transition-colors group"
              >
                {/* Imagen Circular de la Categoría */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full overflow-hidden mb-2 shadow-md border-2 border-transparent group-hover:border-red-500 transition-all">
                  <img
                    src={imageUrl || "https://via.placeholder.com/80?text=🥩"}
                    alt={principalName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Nombre de la Categoría */}
                <span className="text-sm font-semibold text-gray-800 text-center group-hover:text-red-700 transition-colors whitespace-normal wrap-break-wordbreak-words h-10 flex items-center justify-center leading-tight">
                  {principalName}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigator;
