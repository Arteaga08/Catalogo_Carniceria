// src/pages/admin/products/ProductListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa"; // 🟢 FaSearch no es necesario, pero FaPlus sí

const API_BASE_URL = "http://localhost:5001/api";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 🟢 1. Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { token, user } = useAuth();

  // Función para cargar los productos
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      // ⚠️ Usamos la ruta protegida que requiere el token de Admin/Editor
      const response = await axios.get(`${API_BASE_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      console.error("Error al cargar productos:", err);
      setError(
        "No se pudieron cargar los productos. Asegúrate de tener permisos."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]);

  // 🟢 2. Función para manejar el cambio en el input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para eliminar un producto
  const handleDeleteProduct = async (slug) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar el producto con slug: ${slug}?`
      )
    ) {
      return;
    }

    try {
      // DELETE /api/products/:slug
      await axios.delete(`${API_BASE_URL}/products/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si tiene éxito, actualizamos la lista
      setProducts((prev) => prev.filter((p) => p.slug !== slug));
      alert(`Producto con slug "${slug}" eliminado con éxito.`);
    } catch (err) {
      console.error("Error al eliminar:", err);
      setError(
        `Error al eliminar el producto: ${
          err.response?.data?.message || "Error de conexión"
        }`
      );
    }
  };

  // 🟢 3. Lógica de Filtrado Local: Filtra la lista de productos por el término de búsqueda
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase())
    // Opcional: Si tienes SKU, también podrías buscar por product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-xl">
        Cargando listado de productos...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          📦 Gestión de Productos ({filteredProducts.length} de{" "}
          {products.length})
        </h1>
        <button
          onClick={() => navigate("/admin/products/new")}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 shadow-md"
        >
          <FaPlus className="w-4 h-4 mr-2" /> Nuevo Producto
        </button>
      </div>

      {/* 🟢 4. Input de Búsqueda */}
      <div className="mb-6 flex items-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Buscar producto por Nombre o Slug..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
          />
          {/* Icono de Lupa */}
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
      </div>
      {/* 🛑 Fin Input de Búsqueda */}

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-10 border border-gray-200 rounded-lg bg-white">
          <p className="text-lg text-gray-600">
            No hay productos registrados. ¡Crea uno ahora!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Base
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 🟢 Usar filteredProducts para mapear */}
              {filteredProducts.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  {/* Nombre y Slug (columna 1) */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Slug: {product.slug}
                    </div>
                  </td>

                  {/* Categoría (columna 2) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.categorySlug || "N/A"}
                  </td>

                  {/* Precio Base (columna 3) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    ${product.price ? product.price.toFixed(2) : "0.00"}
                  </td>

                  {/* Stock (columna 4) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {product.stock}
                  </td>

                  {/* Estado (columna 5) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.isAvailable
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.isAvailable ? "Disponible" : "Agotado"}
                    </span>
                  </td>

                  {/* Acciones (columna 6) */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/products/edit/${product.slug}`)
                      }
                      title="Editar Producto"
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.slug)}
                      title="Eliminar Producto"
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Mensaje si no hay resultados después de filtrar */}
          {filteredProducts.length === 0 && searchTerm.length > 0 && (
            <div className="text-center py-4 text-gray-500 bg-white border-t">
              No se encontraron productos que coincidan con "{searchTerm}".
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
