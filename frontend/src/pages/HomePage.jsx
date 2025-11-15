import React from 'react';

const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">Nuestro Catálogo</h1>
      <p className="text-xl text-gray-600 mb-8">La carne más fresca a tu mesa.</p>

      {/* Aquí cargaremos el listado de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Placeholder para las tarjetas de productos */}
        <div className="border p-4 rounded-lg shadow-md bg-white">Cargando Producto 1...</div>
        <div className="border p-4 rounded-lg shadow-md bg-white">Cargando Producto 2...</div>
      </div>
    </div>
  );
};

export default HomePage;