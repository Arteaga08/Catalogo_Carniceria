// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/authContext"; // 🟢 CORREGIDO: Importación necesaria de useAuth
import { FaBoxes, FaTags, FaUsers, FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const API_BASE_URL = "http://localhost:5001/api";

const AdminDashboardPage = () => {
  const { token, user } = useAuth();

  // 🟢 ESTADOS PARA CONTEOS (Inicializados a 0)
  const [totalCategories, setTotalCategories] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🟢 FUNCIÓN PARA CARGAR LOS CONTEOS
    const fetchSummary = async () => {
      let fetchedCategoriesCount = 0;
      let fetchedProductsCount = 0;

      try {
        // --- 1. Obtener Conteo de Categorías (Ajuste para formato anidado) ---
        const categoriesResponse = await axios.get(
          `${API_BASE_URL}/categories`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = categoriesResponse.data;

        // 🟢 CORRECCIÓN CLAVE: Verificar si es un objeto (formato anidado)
        if (data && typeof data === "object" && !Array.isArray(data)) {
          let totalCount = 0;
          // Iterar sobre las claves (ej: "Carnes_Rojas", "Aves")
          for (const key in data) {
            const subcategories = data[key];
            // Si la clave contiene un array de subcategorías, sumamos su longitud
            if (Array.isArray(subcategories)) {
              totalCount += subcategories.length;
            }
          }
          fetchedCategoriesCount = totalCount;
          setTotalCategories(fetchedCategoriesCount);
          setError(null); // Limpiamos el error si logramos contar
        }
        // ❌ Eliminamos la antigua verificación `if (Array.isArray(data))` porque ahora manejamos el objeto
        else if (Array.isArray(data)) {
          // Fallback para si alguna vez devuelve un array simple
          fetchedCategoriesCount = data.length;
          setTotalCategories(fetchedCategoriesCount);
          setError(null);
        } else {
          // Si no es array ni objeto válido, seteamos el error
          console.error(
            "API /categories devolvió un formato inesperado:",
            data
          );
          setError(
            "Error: La API de categorías devolvió un formato inesperado."
          );
        }

        // --- 2. Obtener Conteo de Productos (Se mantiene igual) ---
        const productsResponse = await axios.get(
          `${API_BASE_URL}/products?limit=999`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (Array.isArray(productsResponse.data)) {
          fetchedProductsCount = productsResponse.data.length;
          setTotalProducts(fetchedProductsCount);
        } else {
          console.error("API /products no devolvió un array válido.");
        }
      } catch (err) {
        setError(
          "Error al cargar datos del resumen. Verifique el servidor y permisos."
        );
        console.error("Error fetching summary data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
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
      <p className="text-4xl font-extrabold text-gray-900 mt-2">
        {loading ? "..." : value}
      </p>
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

      {/* Mostrar un error general si las llamadas fallaron */}
      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* Resumen Superior */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Categorías Activas"
          // 🟢 Usamos el estado totalCategories
          value={totalCategories}
          icon={FaTags}
          color="red"
          link="/admin/categories"
          linkText="Gestionar Categorías"
        />
        <StatCard
          title="Total de Productos"
          // 🟢 Usamos el estado totalProducts
          value={totalProducts}
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

      {/* 🔴 BLOQUE ELIMINADO: El listado rápido de categorías ya no existe en el código */}
    </div>
  );
};

export default AdminDashboardPage;
