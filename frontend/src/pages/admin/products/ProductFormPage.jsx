import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
// 🟢 1. IMPORTAR fetchCategories para obtener la lista
import { fetchProductBySlug, fetchCategories } from "../../../api/apiService";
import { useAuth } from "../../../context/authContext";
import slugify from "slugify";

// Define la URL de tu API para que sea consistente
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const initialProductData = {
  name: "",
  slug: "",
  description: "",
  price: "",
  stock: "",
  categorySlug: "",
  unitType: "kg",
  isAvailable: true,
};

const ProductFormPage = () => {
  const { token, isAuthenticated, logout } = useAuth();

  const [productData, setProductData] = useState(initialProductData);
  const [categories, setCategories] = useState([]); // 🟢 2. NUEVO ESTADO PARA CATEGORÍAS
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { slug } = useParams();
  const navigate = useNavigate();

  // --- useEffect para cargar datos del producto Y CATEGORÍAS ---
  useEffect(() => {
    // 🟢 FUNCIÓN PARA CARGAR CATEGORÍAS con manejo de estructura anidada
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();

        let allSubcategories = [];

        // Verifica que 'data' sea un objeto (lo que sabemos que es)
        if (data && typeof data === "object" && !Array.isArray(data)) {
          // 1. Obtener todas las claves principales (ej: carnicer-a, carnitas)
          const mainCategorySlugs = Object.keys(data);

          // 2. Iterar sobre cada clave principal
          mainCategorySlugs.forEach((key) => {
            const subcategoriesArray = data[key];

            // 3. Verificar que el valor sea un array de subcategorías
            if (Array.isArray(subcategoriesArray)) {
              // 4. Concatenar (agregar) todos los arrays de subcategorías a la lista plana
              // Las subcategorías son los elementos que contienen el slug y name que necesitamos.
              allSubcategories = allSubcategories.concat(subcategoriesArray);
            }
          });
        }

        // 5. Establecer el estado con la lista plana de subcategorías
        if (Array.isArray(allSubcategories) && allSubcategories.length > 0) {
          setCategories(allSubcategories);
        } else {
          console.error(
            "La respuesta de /api/categories no contiene subcategorías válidas. Estructura recibida:",
            data
          );
          setError(
            "Error: La API de categorías no devolvió subcategorías para el selector."
          );
        }
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("No se pudieron cargar las categorías.");
      }
    };

    loadCategories(); // 🟢 LLAMAR A LA CARGA DE CATEGORÍAS

    // Lógica existente para cargar datos del producto
    if (slug) {
      setIsEditMode(true);
      setLoading(true);
      const loadProduct = async () => {
        try {
          const data = await fetchProductBySlug(slug);
          if (data) {
            setProductData({
              name: data.name || "",
              slug: data.slug || "",
              description: data.description || "",
              price: data.price ? String(data.price) : "",
              stock: data.stock ? String(data.stock) : "",
              categorySlug: data.categorySlug || "",
              unitType: data.unitType || "kg",
              isAvailable:
                data.isAvailable !== undefined ? data.isAvailable : true,
              imageURL: data.imageURL || null,
            });
          }
        } catch (err) {
          console.error("Error al cargar producto para edición:", err);
          setError("No se pudo cargar el producto para editar.");
        } finally {
          setLoading(false);
        }
      };
      loadProduct();
    }
  }, [slug]);

  // --- Handlers de Formulario ---
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProductData((prevData) => {
      let newSlug = prevData.slug;

      if (name === "name") {
        newSlug = slugify(value, {
          lower: true,
          strict: true,
          remove: /[*+~.()'"!:@]/g,
        });
      }

      return {
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
        slug: newSlug,
      };
    });
  };
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ==========================================================
  // FUNCIÓN handleSubmit (SIN CAMBIOS)
  // ==========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isAuthenticated && isEditMode) {
      setError(
        "Error de sesión: No está autenticado. Por favor, inicie sesión."
      );
      setLoading(false);
      logout();
      return;
    }

    const formData = new FormData();
    let finalProductData = { ...productData };

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (isEditMode && productData.imageURL) {
      formData.append("imageURL", productData.imageURL);
    }

    for (const key in finalProductData) {
      const value = finalProductData[key];

      if (key === "imageURL" && !imageFile && isEditMode) {
        // Si el imageURL ya fue enviado arriba, lo ignoramos aquí.
        continue;
      }
      if (key === "slug") {
        // El slug se usa en la URL PUT y no debe ser parte del body, típicamente.
        continue;
      }

      if (key === "unitType" && !value) {
        formData.append(key, "kg");
      } else if (typeof value === "boolean") {
        formData.append(key, value.toString());
      } else if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }

    try {
      let response;

      const config = {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      };

      if (isEditMode) {
        response = await axios.put(
          `${API_URL}/products/${productData.slug}`,
          formData,
          config
        );
        alert("¡Producto actualizado con éxito!");
      } else {
        response = await axios.post(`${API_URL}/products`, formData, config);
        alert("¡Producto creado con éxito!");
        setProductData(initialProductData);
        setImageFile(null);
      }

      navigate("/admin/products");
    } catch (error) {
      setLoading(false);

      const status = error.response?.status;
      const backendMessage =
        error.response?.data?.message || JSON.stringify(error.response?.data);
      const defaultMessage = error.message;

      let finalErrorMessage;

      if (status === 401 || status === 403) {
        finalErrorMessage = `Error de Autorización (${status}). El token es inválido o ha expirado. Por favor, cierre e inicie sesión de nuevo.`;
        logout();
      } else if (status) {
        finalErrorMessage = `Error del servidor (${status}): ${
          backendMessage || "Revisa la consola del servidor."
        }`;
      } else {
        finalErrorMessage = `Error de conexión: No se pudo conectar al servidor API. Revisa que el backend (${API_URL}) esté activo.`;
      }

      console.error(
        `Fallo HTTP al guardar producto. Status: ${
          status || "N/A"
        }. Mensaje del servidor:`,
        backendMessage
      );

      setError(finalErrorMessage);
      alert(finalErrorMessage);
    } finally {
      setLoading(false);
    }
  };
  // ==========================================================
  // FIN DE LA FUNCIÓN handleSubmit
  // ==========================================================

  // --- Renderizado ---

  if (loading && !isEditMode) {
    return <div className="text-center py-10">Cargando formulario...</div>;
  }
  if (loading && isEditMode) {
    return (
      <div className="text-center py-10">Cargando datos del producto...</div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        {isEditMode
          ? `Editar Producto: ${productData.name}`
          : "Crear Nuevo Producto"}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl"
      >
        {/* Nombre y Slug */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Slug (URL)
            </label>
            <input
              type="text"
              name="slug"
              value={productData.slug}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:border-red-500"
              required
            />
          </div>
        </div>

        {/* Descripción */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Descripción
          </label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
            required
          ></textarea>
        </div>

        {/* Precio, Stock, Tipo de Unidad, Categoría */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Precio ($)
            </label>
            <input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleChange}
              step="0.01"
              min="0.01"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Stock
            </label>
            <input
              type="number"
              name="stock"
              value={productData.stock}
              onChange={handleChange}
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Tipo de Unidad
            </label>
            <select
              name="unitType"
              value={productData.unitType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              required
            >
              <option value="kg">Kilogramo (kg)</option>
              <option value="unit">Unidad (unit)</option>
            </select>
          </div>

          {/* 🟢 3. SECCIÓN DE CATEGORÍA: REEMPLAZAR <input> por <select> */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Categoría
            </label>
            <select
              name="categorySlug"
              value={productData.categorySlug}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              required
              disabled={loading}
            >
              <option value="" disabled>
                -- Seleccione una Categoría --
              </option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name} ({category.slug})
                </option>
              ))}
            </select>
            {categories.length === 0 && !loading && error && (
              <p className="text-sm text-red-500 mt-2">
                Error al cargar categorías: {error}
              </p>
            )}
            {categories.length === 0 && !loading && !error && (
              <p className="text-sm text-gray-500 mt-2">
                Cargando categorías...
              </p>
            )}
          </div>
        </div>

        {/* Imagen y Disponibilidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {isEditMode ? "Cambiar Imagen" : "Subir Imagen"}
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500 bg-white"
              required={
                !isEditMode ||
                (isEditMode && !productData.imageURL && !imageFile)
              }
            />
            {isEditMode && productData.imageURL && (
              <p className="text-sm text-gray-500 mt-2">
                Imagen actual cargada.
              </p>
            )}
          </div>

          <div className="flex items-center pt-8">
            <input
              type="checkbox"
              name="isAvailable"
              id="isAvailable"
              checked={productData.isAvailable}
              onChange={handleChange}
              className="h-5 w-5 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label
              htmlFor="isAvailable"
              className="ml-2 block text-gray-900 font-semibold"
            >
              Producto Disponible
            </label>
          </div>
        </div>

        {/* Botón de Submit y Mensajes */}
        <div className="mt-8">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors duration-200 disabled:bg-gray-400"
          >
            {loading
              ? "Guardando..."
              : isEditMode
              ? "Actualizar Producto"
              : "Crear Producto"}
          </button>
          {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
