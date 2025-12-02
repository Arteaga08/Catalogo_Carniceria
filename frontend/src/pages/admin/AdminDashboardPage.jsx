// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext";
import { FaBoxes, FaTags, FaUsers, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001/api";

const AdminDashboardPage = () => {
  const { token, user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 1. Cargar la lista de categorías
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(response.data)) {
            setCategories(response.data)
        } else {
            console.log("La api no devolvio un array de categorias", response.data)
            setCategories([])
            setError("La respuesta del servidor no es válida.");
        }
      } catch (err) {
        setError(
          "Error al cargar categorías. Verifique su conexión y permisos."
        );
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    // 2. Aquí podrías cargar el conteo total de productos, si lo tuvieras en un endpoint
    // fetchProductCount();

    fetchCategories();
  }, [token]);

  // Componente de Tarjeta de Resumen (Card)
  const StatCard = ({ title, value, icon: Icon, color, link, linkText }) => (
    <div
      className={`p-6 bg-white rounded-xl shadow-md border-l-4 border-${color}-500 transition hover:shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <Icon className={`w-8 h-8 text-${color}-600`} />
        <p className="text-sm font-medium text-gray-500">{title}</p>
      </div>
      <p className="text-4xl font-extrabold text-gray-900 mt-2">{value}</p>
      {link && (
        <Link
          to={link}
          className={`mt-4 flex items-center text-sm font-semibold text-${color}-600 hover:text-${color}-800`}
        >
          {linkText} <FaArrowRight className="w-3 h-3 ml-2" />
        </Link>
      )}
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8">
        Bienvenido, {user?.name || "Administrador"}
      </h1>

      {/* Resumen Superior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard
          title="Categorías Activas"
          value={categories.length}
          icon={FaTags}
          color="red"
          link="/admin/categories"
          linkText="Gestionar Categorías"
        />
        <StatCard
          title="Total de Productos"
          value="XX" // ⚠️ Reemplaza con el conteo real de tu API
          icon={FaBoxes}
          color="indigo"
          link="/admin/products"
          linkText="Gestionar Productos"
        />
        <StatCard
          title="Mi Rol"
          value={user?.role.toUpperCase() || "N/A"}
          icon={FaUsers}
          color="green"
          link={null}
        />
      </div>

      {/* Listado Rápido de Categorías */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex justify-between items-center">
          Listado Rápido de Categorías
          <Link
            to="/admin/categories"
            className="text-sm font-semibold text-red-600 hover:text-red-800"
          >
            Ver todas &rarr;
          </Link>
        </h2>

        {loading ? (
          <p className="text-gray-500">Cargando categorías...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : categories.length === 0 ? (
          <p className="text-gray-500">No hay categorías registradas.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.slice(0, 8).map((cat) => (
              <div
                key={cat.slug}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition duration-150"
              >
                <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                <p className="text-xs text-gray-500 mt-1">Slug: {cat.slug}</p>
                {/* Puedes añadir más estadísticas de la categoría aquí si las tienes */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
