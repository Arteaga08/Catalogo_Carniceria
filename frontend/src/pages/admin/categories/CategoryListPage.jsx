// src/pages/admin/categories/CategoryListPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";
import { FaEdit, FaTrashAlt, FaPlus } from "react-icons/fa";

const API_BASE_URL = "http://localhost:5001/api";

const CategoryListPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // 🟢 1. Nuevo estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const { token } = useAuth();

  // Función para cargar las categorías
  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const categoryGroups = response.data;

      if (typeof categoryGroups === "object" && categoryGroups !== null) {
        // Aseguramos una lista plana de categorías para el listado de administración
        const flatList = Object.values(categoryGroups)
          .flat()
          .filter((item) => item && item.slug);

        setCategories(flatList);
      } else {
        console.error("Respuesta inesperada:", categoryGroups);
        setError("Error en el formato de datos del servidor.");
        setCategories([]);
      }
    } catch (err) {
      console.error("Error al cargar categorías:", err);
      setError(
        err.response?.data?.message || "No se pudieron cargar las categorías."
      );
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [token]);

  // 🟢 2. Función para manejar el cambio en el input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Función para eliminar una categoría
  const handleDeleteCategory = async (slug) => {
    if (
      !window.confirm(
        `¿Estás seguro de que quieres eliminar la categoría "${slug}"? ¡Esto puede afectar a los productos asociados!`
      )
    ) {
      return;
    }

    try {
      // DELETE /api/categories/:slug
      await axios.delete(`${API_BASE_URL}/categories/${slug}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Si tiene éxito, actualizamos la lista
      setCategories((prev) => prev.filter((c) => c.slug !== slug));
      alert(`Categoría "${slug}" eliminada con éxito.`);
    } catch (err) {
      console.error("Error al eliminar:", err);
      const message =
        err.response?.data?.message ||
        "Ocurrió un error inesperado al eliminar.";
      setError(`Error al eliminar: ${message}`);
    }
  };

  // 🟢 3. Lógica de Filtrado Local
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="text-center py-10 text-xl">
        Cargando listado de categorías...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          🏷️ Gestión de Categorías ({filteredCategories.length} de{" "}
          {categories.length})
        </h1>
        <button
          onClick={() => navigate("/admin/categories/new")}
          className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-150 shadow-md"
        >
          <FaPlus className="w-4 h-4 mr-2" /> Nueva Categoría
        </button>
      </div>

      {/* 🟢 4. Input de Búsqueda */}
      <div className="mb-6 flex items-center">
        <div className="relative w-full max-w-lg">
          <input
            type="text"
            placeholder="Buscar categoría por Nombre o Slug..."
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

      {categories.length === 0 ? (
        <div className="text-center py-10 border border-gray-200 rounded-lg bg-white">
          <p className="text-lg text-gray-600">
            No hay categorías registradas. ¡Crea una ahora!
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 🟢 Usar filteredCategories para mapear */}
              {filteredCategories.map((category) => (
                <tr key={category.slug} className="hover:bg-gray-50">
                  {/* Nombre */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {category.name}
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>

                  {/* Tipo (Asumiendo que tu modelo Category tiene un campo 'type' o similar) */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {category.parentSlug ? "Sub-Categoría" : "Principal"}
                    </span>
                  </td>

                  {/* Acciones */}
                  <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium space-x-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/categories/edit/${category.slug}`)
                      }
                      title="Editar Categoría"
                      className="text-indigo-600 hover:text-indigo-900 p-1"
                    >
                      <FaEdit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.slug)}
                      title="Eliminar Categoría"
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FaTrashAlt className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {/* Mensaje si no hay resultados después de filtrar */}
              {filteredCategories.length === 0 && searchTerm.length > 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-4 text-gray-500 bg-white border-t"
                  >
                    No se encontraron categorías que coincidan con "{searchTerm}
                    ".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CategoryListPage;
