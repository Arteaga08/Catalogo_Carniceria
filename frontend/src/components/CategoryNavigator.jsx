// Archivo: frontend/src/components/CategoryNavigator.jsx

import React from "react";
import { Link } from "react-router-dom";

const CategoryNavigator = ({ categories }) => {
  const principalCategories = Object.keys(categories || {});

  if (principalCategories.length === 0) return null;

  const getPrincipalCategoryImage = (principalName) => {
    const firstSub = categories[principalName] && categories[principalName][0];
    return firstSub ? firstSub.imageURL : null;
  };

  return (
    <div className="bg-red-600 py-2 shadow-inner">
      <div className="container mx-auto px-2">
        <div
          className="flex gap-2 overflow-x-auto pb-1 max-w-full -mx-2 px-2 items-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {principalCategories.map((principalName) => {
            const imageUrl = getPrincipalCategoryImage(principalName);
            const linkSlug = categories[principalName]?.[0]?.slug || "";

            return (
              <Link
                key={principalName}
                to={`/products/category/${linkSlug}`}
                className="flex flex-col items-center justify-start w-20 md:w-24 lg:w-28 shrink-0 p-1 rounded-md hover:bg-red-500/10 transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden mb-1 shadow-sm border border-transparent group-hover:border-white transition-all">
                  <img
                    src={imageUrl || "https://via.placeholder.com/80?text=🥩"}
                    alt={principalName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <span className="text-xs font-semibold text-white text-center group-hover:text-white transition-colors wrap-break-word h-6 flex items-center justify-center leading-tight">
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
