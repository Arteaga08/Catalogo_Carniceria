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
  parentSlug: "",
  categoryPrincipal: "",
};

const CategoryFormPage = () => {
  const { slug } = useParams(); // Slug para el modo Edición
  const navigate = useNavigate();
  const { token } = useAuth();

  const [categoryData, setCategoryData] = useState(initialCategoryState);
  const [allCategories, setAllCategories] = useState([]); // Para el selector de categorías padre
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // Siempre cargamos al inicio

  const [imageFile, setImageFile] = useState(null);
  const [currentImageURL, setCurrentImageURL] = useState(null);
  
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

        const apiData = categoryRes.data;
        let categoriesArray = [];
        if (Array.isArray(apiData)) {
          categoriesArray = apiData;
        } else if (typeof apiData === "object" && apiData !== null) {
          // Manejo de respuesta agrupada
          categoriesArray = Object.values(apiData)
            .flat()
            .filter((cat) => cat && cat.slug);
        }
        setAllCategories(categoriesArray);

        if (slug) {
          setIsEditMode(true);
          // Cargar categoría específica para edición
          const response = await axios.get(
            `${API_BASE_URL}/categories/${slug}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const loadedData = response.data;
          const parentSlug = loadedData.parentCategory?.slug || "";

          setCategoryData({
            ...loadedData,
            parentSlug: parentSlug,
            categoryPrincipal: loadedData.categoryPrincipal || loadedData.slug,
          });
          if (loadedData.imageURL) {
            setCurrentImageURL(loadedData.imageURL);
          }
        } else {
          // Modo Creación
          setCategoryData(initialCategoryState);
          setIsEditMode(false);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
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
      const newSlug = generateSlug(newName);
      setCategoryData((prev) => ({
        ...prev,
        slug: newSlug,
        // Si no hay parentSlug (es principal), la categoryPrincipal es ella misma (el newSlug)
        categoryPrincipal: prev.parentSlug ? prev.categoryPrincipal : newSlug,
      }));
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // 🟢 FUNCIÓN AGREGADA/CORREGIDA: Maneja el cambio de la categoría padre y categoryPrincipal
  const handleParentSlugChange = (e) => {
    const newParentSlug = e.target.value;

    // Obtener la categoría padre seleccionada (si existe) para obtener su categoryPrincipal
    const selectedParent = allCategories.find(
      (cat) => cat.slug === newParentSlug
    );

    setCategoryData((prev) => ({
      ...prev,
      parentSlug: newParentSlug,
      // Lógica de categoryPrincipal: Si tiene padre, usa el categoryPrincipal del padre. Si no tiene, usa su propio slug.
      categoryPrincipal: selectedParent
        ? selectedParent.categoryPrincipal
        : prev.slug,
    }));
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

      // 🟢 CLAVE: Usar FormData para enviar archivos
      const formData = new FormData();

      formData.append("name", categoryData.name);
      formData.append("slug", categoryData.slug);

      // Adjuntar solo si tienen valor
      if (categoryData.description) {
        formData.append("description", categoryData.description);
      }
      if (categoryData.parentSlug) {
        formData.append("parentSlug", categoryData.parentSlug);
      }
      // categoryPrincipal es obligatorio
      formData.append(
        "categoryPrincipal",
        categoryData.categoryPrincipal || categoryData.slug
      );

      // 2. Adjuntar la imagen si fue seleccionada
      if (imageFile) {
        formData.append("image", imageFile); // 'image' debe coincidir con el campo esperado por Multer en el backend
      } else if (isEditMode && currentImageURL) {
        // Si no se cambia la imagen pero estamos editando, enviamos la URL actual
        formData.append("imageURL", currentImageURL);
      }

      // 3. Enviar el FormData con el Content-Type correcto (manejado automáticamente por axios/FormData)
      await method(url, formData, {
        // ⬅️ Cambiamos dataToSend por formData
        headers: {
          Authorization: `Bearer ${token}`,
          // NOTA: No especificar Content-Type. FormData lo maneja como multipart/form-data
        },
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
        // Usar 'path', 'param' o 'field' para obtener el nombre del campo del error.
        serverResponse.data.errors.forEach((err) => {
          const fieldName = err.path || err.param || err.field; // Cobertura más amplia
          if (fieldName) {
            validationErrors[fieldName] = err.msg;
          }
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

        {/* Carga de Imagen */}
        <div className="border p-4 rounded-md bg-gray-50">
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Imagen de la Categoría
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none"
            // Requerir solo si no estamos editando o si no hay URL de imagen previa
            required={!isEditMode && !currentImageURL}
          />

          {isEditMode && currentImageURL && !imageFile && (
            <div className="mt-3 text-sm text-gray-600 flex items-center">
              <span className="mr-2">Imagen actual:</span>
              <img
                src={`${API_BASE_URL}${currentImageURL}`} // Usar URL absoluta para visualizar
                alt="Imagen actual de la categoría"
                className="w-16 h-16 object-cover rounded-md border border-gray-300"
              />
              <span className="ml-3 text-xs text-red-500">
                (Selecciona un nuevo archivo para reemplazarla)
              </span>
            </div>
          )}
          {serverErrors.image && (
            <p className="text-red-500 text-xs mt-1">{serverErrors.image}</p>
          )}
        </div>

        {/* Categoría Padre (Para crear sub-categorías) */}
        <div>
          {/* 🟢 INTERFAZ MEJORADA PARA ELEGIR NIVEL */}
          <label
            htmlFor="parentSlug"
            className="block text-sm font-medium text-gray-700"
          >
            Pertenencia de la Categoría
          </label>
          <p className="text-xs text-gray-500 mb-2">
            Elige si esta será una **Categoría Principal** (Nivel 1) o si debe
            asignarse como **Subcategoría** a una principal existente (Nivel 2).
          </p>

          <select
            id="parentSlug"
            name="parentSlug"
            value={categoryData.parentSlug}
            onChange={handleParentSlugChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
          >
            {/* OPCIÓN CLAVE: Creación de Categoría de Nivel Superior */}
            <option value="">
              ✅ Crear como Categoría PRINCIPAL (Nivel 1)
            </option>

            <optgroup label="--- Añadir Subcategoría a Categoría Principal (Nivel 2) ---">
              {allCategories
                // 🛑 FILTRO REFORZADO: Aseguramos que parentSlug sea falsey (vacío, null, o undefined)
                .filter((cat) => !cat.parentSlug)
                // Y no se puede ser padre de sí misma
                .filter((cat) => cat.slug !== categoryData.slug)
                .map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    Añadir a: {cat.name}
                  </option>
                ))}
            </optgroup>
          </select>

          {serverErrors.parentSlug && (
            <p className="text-red-500 text-xs mt-1">
              {serverErrors.parentSlug}
            </p>
          )}
        </div>

        {/* Campo oculto de categoryPrincipal para cumplir la validación de Mongoose */}
        <input
          type="hidden"
          name="categoryPrincipal"
          value={categoryData.categoryPrincipal}
        />

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
