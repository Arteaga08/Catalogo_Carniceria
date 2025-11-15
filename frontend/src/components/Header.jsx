import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-red-700 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        
        {/* Enlace al Home */}
        <Link to="/" className="text-3xl font-extrabold tracking-tight hover:text-red-300 transition-colors">
          🥩 Carnicería
        </Link>
        
        {/* Sección de Navegación/Carrito */}
        <div>
          {/* Este será nuestro icono de carrito */}
          <Link to="/cart" className="text-xl hover:text-red-300 transition-colors">
            🛒 Carrito (0)
          </Link>
        </div>
      </div>
      
      {/* Placeholder para la Navegación de Categorías (lo llenaremos después) */}
      <nav className="bg-red-800 py-2">
        <div className="container mx-auto px-4">
          {/* Este div contendrá las pestañas de categorías traídas desde la API */}
          <div className="flex space-x-4 text-sm font-medium">
            <span className="opacity-70">Cargando categorías...</span>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;