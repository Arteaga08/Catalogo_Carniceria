// Archivo: frontend/src/components/ScrollToTop.jsx

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Obtiene el objeto de ubicación (pathname, search, hash, etc.)
  const { pathname } = useLocation();

  useEffect(() => {
    // Esta función se ejecuta cada vez que 'pathname' (la ruta) cambia
    window.scrollTo(0, 0);
  }, [pathname]); // Dependencia: re-ejecutar cuando la ruta cambia

  // Este componente no renderiza nada visible, es solo lógica
  return null;
};

export default ScrollToTop;
