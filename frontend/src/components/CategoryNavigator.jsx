import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const CategoryNavigator = ({
  categories,
  activeSlug,
  selectedPrincipalFromSidebar,
}) => {
  const [selectedPrincipal, setSelectedPrincipal] = useState(null);
  const principalCategories = Object.keys(categories || {});
  const location = useLocation();
  const navigate = useNavigate();

  // Resetear selectedPrincipal cuando se navega a inicio
  useEffect(() => {
    if (location.pathname === "/") {
      setSelectedPrincipal(null);
    }
  }, [location.pathname]);

  // Auto-actualizar selectedPrincipal cuando activeSlug cambia
  useEffect(() => {
    if (activeSlug) {
      const parentPrincipal = principalCategories.find((principal) =>
        categories[principal]?.some((subCat) => subCat.slug === activeSlug)
      );
      if (parentPrincipal) {
        setSelectedPrincipal(parentPrincipal);
      }
    }
  }, [activeSlug, principalCategories, categories]);

  // Actualizar cuando se selecciona desde el Sidebar
  useEffect(() => {
    if (selectedPrincipalFromSidebar) {
      setSelectedPrincipal(selectedPrincipalFromSidebar);
    }
  }, [selectedPrincipalFromSidebar]);

  if (principalCategories.length === 0) return null;

  let itemsToDisplay = [];
  let isShowingSubcategories = false;
  let currentPrincipalName = null;

  // Si hay un principal seleccionado, mostrar sus subcategorías
  if (selectedPrincipal && categories[selectedPrincipal]) {
    itemsToDisplay = categories[selectedPrincipal].map((subCat) => ({
      displayName: subCat.name,
      linkSlug: subCat.slug,
      // Guardar el dato de imagen desde cualquier campo conocido
      imageURL:
        subCat.imageURL || subCat.iconURL || subCat.imageUrl || subCat.image || null,
    }));
    isShowingSubcategories = true;
    currentPrincipalName = selectedPrincipal;
  } else {
    // Si no, mostrar las categorías principales
    itemsToDisplay = principalCategories.map((principalName) => {
      const firstSub =
        categories[principalName] && categories[principalName][0];
        return {
          displayName: principalName,
          linkSlug: firstSub?.slug || "",
          // Guardar el dato de imagen desde cualquier campo conocido
          imageURL:
            firstSub?.imageURL || firstSub?.iconURL || firstSub?.imageUrl || firstSub?.image || null,
          principalName: principalName,
        };
    });
  }

  const handlePrincipalClick = (e, principalName) => {
    e.preventDefault();
    setSelectedPrincipal(principalName);
  };

  return (
    <div className="bg-red-600 py-2 shadow-inner">
      <div className="container mx-auto px-2">
        <div
          className="flex gap-2 overflow-x-auto pb-1 max-w-full -mx-2 px-2 items-center"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {isShowingSubcategories && (
            <Link
              to="/"
              className="flex flex-col items-center justify-start w-20 md:w-24 lg:w-28 shrink-0 p-1 rounded-md hover:bg-red-500/10 transition-colors group"
              title="Ir a inicio"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden mb-1 shadow-sm border border-transparent group-hover:border-white transition-all flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <span className="text-xs font-semibold text-white text-center group-hover:text-white transition-colors wrap-break-word h-6 flex items-center justify-center leading-tight">
                Inicio
              </span>
            </Link>
          )}

          {itemsToDisplay.map((item) => {
            // Determinar src robustamente y evitar reusar un valor global
            const imgSrc =
              item.imageURL || item.imageUrl || item.iconURL || item.image || "/images/default_category_icon.png";
            // DEBUG: ver qué src se está usando por item
            // eslint-disable-next-line no-console
            console.log("CategoryNavigator render item:", item.displayName, imgSrc);

            if (isShowingSubcategories) {
              return (
                <Link
                  key={item.linkSlug}
                  to={`/products/category/${item.linkSlug}`}
                  className="flex flex-col items-center justify-start w-20 md:w-24 lg:w-28 shrink-0 p-1 rounded-md hover:bg-red-500/10 transition-colors group"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden mb-1 shadow-sm border border-transparent group-hover:border-white transition-all">
                    <img
                      // Usamos la variable corregida
                      src={imgSrc}
                      alt={item.displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-xs font-semibold text-white text-center group-hover:text-white transition-colors wrap-break-word h-6 flex items-center justify-center leading-tight">
                    {item.displayName}
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={item.principalName}
                onClick={(e) => {
                  handlePrincipalClick(e, item.principalName, item.linkSlug);
                  navigate(`/products/category/${item.linkSlug}`);
                }}
                className="flex flex-col items-center justify-start w-20 md:w-24 lg:w-28 shrink-0 p-1 rounded-md hover:bg-red-500/10 transition-colors group"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full overflow-hidden mb-1 shadow-sm border border-transparent group-hover:border-white transition-all">
                  <img
                    // Usamos la variable corregida
                    src={imgSrc}
                    alt={item.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-xs font-semibold text-white text-center group-hover:text-white transition-colors wrap-break-word h-6 flex items-center justify-center leading-tight">
                  {item.displayName}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryNavigator;
