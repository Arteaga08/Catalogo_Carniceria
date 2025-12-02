// src/pages/admin/categories/CategoryFormPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

const API_BASE_URL = "http://localhost:5001/api";

const initialCategoryState = {
  name: "",
  slug: "", // El slug se generará o se usará para la edición
  description: "",
  parentSlug: "", // Para sub-categorías
};

const CategoryFormPage = () => {
  const { slug } = useParams(); // Slug para el modo Edición
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categoryData, setCategoryData] = useState(initialCategoryState);
  const [allCategories, setAllCategories] = useState([]); // Para el selector de categorías padre
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // Siempre cargamos al inicio
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState({});

  // 1. Cargar todas las categorías (para el selector parentSlug)
  // 2. Cargar la categoría existente (si es modo edición)
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Cargar todas las categorías
        const categoryRes = await axios.get(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCategories(categoryRes.data);

        if (slug) {
          setIsEditMode(true);
          // Cargar categoría específica para edición
          const response = await axios.get(
            `${API_BASE_URL}/categories/${slug}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setCategoryData(response.data);
        } else {
          // Modo Creación
          setCategoryData(initialCategoryState);
          setIsEditMode(false);
        }
      } catch (err) {
        setError(
          `Error al cargar los datos: ${
            err.response?.data?.message || err.message
          }`
        );
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [slug, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar errores específicos
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Función para generar un slug simple (opcional, tu backend debería hacer esto)
  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const handleNameChange = (e) => {
    const newName = e.target.value;
    setCategoryData((prev) => ({ ...prev, name: newName }));

    // Si no estamos editando o si el slug no ha sido modificado manualmente, lo generamos
    if (!isEditMode || categoryData.slug === generateSlug(categoryData.name)) {
      setCategoryData((prev) => ({ ...prev, slug: generateSlug(newName) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setServerErrors({});

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/categories/${slug}`
        : `${API_BASE_URL}/categories`;

      const method = isEditMode ? axios.put : axios.post;

      // Enviar datos
      await method(url, categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Éxito: Navegar al listado de categorías
      navigate("/admin/categories");
    } catch (err) {
      const serverResponse = err.response;
      if (
        serverResponse &&
        serverResponse.status === 400 &&
        serverResponse.data.errors
      ) {
        // Errores de validación
        const validationErrors = {};
        serverResponse.data.errors.forEach((err) => {
          validationErrors[err.path] = err.msg;
        });
        setServerErrors(validationErrors);
        setError("Hay errores en el formulario. Por favor, revísalos.");
      } else {
        // Otros errores
        setError(
          serverResponse?.data?.message ||
            "Ocurrió un error inesperado al guardar la categoría."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && slug) {
    return (
      <div className="text-center py-10">Cargando datos de la categoría...</div>
    );
  }

  const title = isEditMode
    ? `📝 Editar Categoría: ${categoryData.name}`
    : "➕ Crear Nueva Categoría";

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">{title}</h1>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre de la Categoría */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Nombre
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={categoryData.name}
            onChange={handleNameChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
          />
          {serverErrors.name && (
            <p className="text-red-500 text-xs mt-1">{serverErrors.name}</p>
          )}
        </div>

        {/* Slug */}
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            Slug (URL)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            value={categoryData.slug}
            onChange={handleInputChange}
            // El slug debe ser editable, pero advertimos si es modo edición
            readOnly={isEditMode}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-gray-700 ${
              isEditMode
                ? "bg-gray-100 cursor-not-allowed"
                : "focus:ring-red-500 focus:border-red-500"
            }`}
          />
          {isEditMode && (
            <p className="text-xs text-gray-500 mt-1">
              El Slug no debe modificarse en modo edición a menos que sea
              necesario.
            </p>
          )}
          {serverErrors.slug && (
            <p className="text-red-500 text-xs mt-1">{serverErrors.slug}</p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Descripción (Opcional)
          </label>
          <textarea
            id="description"
            name="description"
            value={categoryData.description}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 h-20"
          />
          {serverErrors.description && (
            <p className="text-red-500 text-xs mt-1">
              {serverErrors.description}
            </p>
          )}
        </div>

        {/* Categoría Padre (Para crear sub-categorías) */}
        <div>
          <label
            htmlFor="parentSlug"
            className="block text-sm font-medium text-gray-700"
          >
            Categoría Padre (Para Sub-categoría)
          </label>
          <select
            id="parentSlug"
            name="parentSlug"
            value={categoryData.parentSlug}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">(Ninguna) - Categoría Principal</option>
            {allCategories
              // Filtramos la categoría actual para que no se pueda ser padre de sí misma
              .filter((cat) => cat.slug !== categoryData.slug)
              .map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name} ({cat.slug})
                </option>
              ))}
          </select>
          {serverErrors.parentSlug && (
            <p className="text-red-500 text-xs mt-1">
              {serverErrors.parentSlug}
            </p>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/categories")}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 border border-transparent rounded-md text-white font-medium shadow-sm transition duration-150 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            }`}
          >
            {loading
              ? "Guardando..."
              : isEditMode
              ? "Guardar Cambios"
              : "Crear Categoría"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryFormPage;
