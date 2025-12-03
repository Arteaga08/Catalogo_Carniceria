// src/pages/admin/products/ProductFormPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext";

// URL base de tu backend
const API_BASE_URL = "http://localhost:5001/api";

// Estado inicial del producto para creación (LIMPIO)
const initialProductState = {
  name: "",
  description: "",
  price: 0.0,
  stock: 0,
  imageURL: "", // Usado solo para previsualización local o URL de edición
  categorySlug: "",
  unitType: "kg",
  isAvailable: true,
};

const ProductFormPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [productData, setProductData] = useState(initialProductState);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null); // Para el archivo binario
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState({});

  // 1. Cargar Categorías (CON CORRECCIÓN DE FORMATO)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/categories`);

        // Transformamos el objeto anidado en un array plano
        const categoryGroups = response.data;
        if (typeof categoryGroups === "object" && categoryGroups !== null) {
          const flatList = Object.values(categoryGroups)
            .flat()
            .filter((item) => item && item.slug);
          setCategories(flatList);
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("Error al cargar las categorías. Intenta recargar la página.");
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  // 2. Cargar Producto Existente (Modo Edición - LIMPIO)
  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      setLoading(true);
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/products/${slug}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          // Mapear los datos del producto a nuestro estado
          const data = response.data;
          setProductData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || 0.01,
            stock: data.stock || 0,
            imageURL: data.imageURL || "", // Carga la URL existente
            categorySlug: data.categorySlug || "",
            unitType: data.unitType || "kg",
            // 🛑 Eliminamos 'variations'
            isAvailable:
              data.isAvailable !== undefined ? data.isAvailable : true,
          });
        } catch (err) {
          setError(
            `Error al cargar el producto: ${
              err.response?.data?.message || err.message
            }`
          );
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    } else {
      // Modo Creación:
      // 🛑 Eliminamos la línea que usaba initialVariation
      setIsEditMode(false);
    }
  }, [slug, token]);

  // 3. Manejar Cambios en Campos Simples
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Manejar Archivo de Imagen
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Crea una URL temporal para la previsualización
      setProductData((prev) => ({
        ...prev,
        imageURL: URL.createObjectURL(file),
      }));
    } else {
      setImageFile(null);
      setProductData((prev) => ({ ...prev, imageURL: "" }));
    }
  };

  // 🛑 Eliminados: handleVariationChange, addVariation, removeVariation, handleImageUpload (URL)

  // 4. Manejar Envío del Formulario (POST/PUT con FormData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setServerErrors({});

    try {
      const url = isEditMode
        ? `${API_BASE_URL}/products/${slug}`
        : `${API_BASE_URL}/products`;

      const method = isEditMode ? axios.put : axios.post;

      const formData = new FormData();

      // 1. Agregar el archivo de imagen si existe
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (isEditMode && productData.imageURL) {
        // Si estamos editando y no subió un nuevo archivo, envía la URL existente
        // para que el backend sepa que la imagen no cambió.
        formData.append("imageURL", productData.imageURL);
      }

      // 2. Agregar todos los demás campos del producto
      for (const key in productData) {
        // Ignoramos imageURL si estamos en modo creación O si ya lo pusimos arriba
        if (key !== "imageURL") {
          formData.append(key, productData[key]);
        }
      }

      // 3. Ajustar headers
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await method(url, formData, config);

      // Éxito: Navegar a la página de listado de productos
      navigate("/admin/products");
    } catch (err) {
      const serverResponse = err.response;
      if (
        serverResponse &&
        serverResponse.status === 400 &&
        serverResponse.data.errors
      ) {
        const validationErrors = {};
        serverResponse.data.errors.forEach((err) => {
          validationErrors[err.path] = err.msg;
        });
        setServerErrors(validationErrors);
        setError("Hay errores en el formulario. Por favor, revísalos.");
      } else {
        setError(
          serverResponse?.data?.message ||
            "Ocurrió un error inesperado al guardar el producto."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode) {
    return (
      <div className="text-center py-10">Cargando datos del producto...</div>
    );
  }

  const title = isEditMode
    ? `📝 Editar Producto: ${productData.name}`
    : "➕ Crear Nuevo Producto";

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-lg">
      <h1 className="text-4xl font-extrabold text-gray-800 mb-8">{title}</h1>

      {error && (
        <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* === SECCIÓN 1: DATOS BÁSICOS === */}
        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Información General
          </h2>

          {/* Nombre */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre del Producto
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={productData.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
            />
            {serverErrors.name && (
              <p className="text-red-500 text-xs mt-1">{serverErrors.name}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              required
              value={productData.description}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500 h-24"
            />
            {serverErrors.description && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.description}
              </p>
            )}
          </div>

          {/* Información Numérica */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
            {/* Precio Base */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Precio Base
              </label>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0.01"
                required
                value={productData.price}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
              />
              {serverErrors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {serverErrors.price}
                </p>
              )}
            </div>

            {/* Stock (Cantidad Total) */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-gray-700"
              >
                Stock Total
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                required
                value={productData.stock}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
              />
              {serverErrors.stock && (
                <p className="text-red-500 text-xs mt-1">
                  {serverErrors.stock}
                </p>
              )}
            </div>

            {/* Tipo de Unidad */}
            <div>
              <label
                htmlFor="unitType"
                className="block text-sm font-medium text-gray-700"
              >
                Unidad de Venta
              </label>
              <select
                id="unitType"
                name="unitType"
                required
                value={productData.unitType}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="kg">Por Kilogramo (Kg)</option>
                <option value="unit">Por Pieza / Paquete (Unidad)</option>
              </select>
            </div>

            {/* Disponibilidad */}
            <div className="flex items-center mt-6">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                checked={productData.isAvailable}
                onChange={handleInputChange}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="isAvailable"
                className="ml-2 block text-sm font-medium text-gray-700"
              >
                Disponible para Venta
              </label>
            </div>
          </div>

          {/* Selector de Categoría */}
          <div className="mt-6">
            <label
              htmlFor="categorySlug"
              className="block text-sm font-medium text-gray-700"
            >
              Categoría
            </label>
            <select
              id="categorySlug"
              name="categorySlug"
              required
              value={productData.categorySlug}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Selecciona una Categoría...</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            {serverErrors.categorySlug && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.categorySlug}
              </p>
            )}
          </div>

          {/* Subida de Imagen Principal (Input File) */}
          <div className="mt-6">
            <label
              htmlFor="imageFile"
              className="block text-sm font-medium text-gray-700"
            >
              Subir Imagen Principal
            </label>
            <input
              type="file"
              id="imageFile"
              name="imageFile"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
            />
            {productData.imageURL && (
              <div className="mt-4 w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={productData.imageURL}
                  alt="Previsualización"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {serverErrors.image && (
              <p className="text-red-500 text-xs mt-1">{serverErrors.image}</p>
            )}
          </div>
        </section>

        {/* === BOTONES DE ACCIÓN === */}
        <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
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
              : "Crear Producto"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormPage;
