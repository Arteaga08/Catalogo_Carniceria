import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-12 py-6">
      <div className="container mx-auto text-center px-4">
        <p>&copy; {new Date().getFullYear()} Carnicería MERN. Todos los derechos reservados.</p>
        <p className="text-sm text-gray-400 mt-1">Desarrollado con React, Node.js y Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;