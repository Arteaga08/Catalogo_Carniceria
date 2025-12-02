// src/pages/admin/products/ProductFormPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../../context/authContext"; // Ajusta la ruta si es necesario

// URL base de tu backend
const API_BASE_URL = "http://localhost:5001/api";

// Estado inicial del producto para creación
const initialProductState = {
  name: "",
  description: "",
  price: 0.01,
  stock: 0,
  imageURL: "",
  categorySlug: "", // Necesitamos el slug de la categoría
  variations: [], // Array de variaciones
  isAvailable: true,
};

// Estado inicial de una variación
const initialVariation = {
  unitName: "", // Ej: "Kg", "Unidad", "Pieza"
  price: 0.01,
  unitReference: "", // Ej: "1 KG", "1 UNIDAD"
  approxWeightGrams: 1000,
  isIntegerUnit: true,
};

const ProductFormPage = () => {
  const { slug } = useParams(); // Usaremos el slug para el modo Edición
  const navigate = useNavigate();
  const { token } = useAuth(); // Para asegurar que tenemos el token

  const [productData, setProductData] = useState(initialProductState);
  const [categories, setCategories] = useState([]); // Para el selector de categoría
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [serverErrors, setServerErrors] = useState({}); // Para errores de validación del backend

  // 1. Cargar Categorías (se necesita para el selector)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Obtenemos solo las categorías para el selector. Usamos /api/categories
        // ⚠️ ASUMIMOS QUE TU BACKEND PERMITE GET /api/categories SIN AUTENTICACIÓN
        const response = await axios.get(`${API_BASE_URL}/categories`);
        setCategories(response.data);
      } catch (err) {
        console.error("Error al cargar categorías:", err);
        setError("Error al cargar las categorías. Intenta recargar la página.");
      }
    };
    fetchCategories();
  }, []); // Se ejecuta solo al montar el componente

  // 2. Cargar Producto Existente (Modo Edición)
  useEffect(() => {
    if (slug) {
      setIsEditMode(true);
      setLoading(true);
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/products/${slug}`, {
            headers: { Authorization: `Bearer ${token}` }, // Necesitas token para obtener detalles si la ruta está protegida
          });

          // Mapear los datos del producto a nuestro estado
          const data = response.data;
          setProductData({
            name: data.name || "",
            description: data.description || "",
            price: data.price || 0.01,
            stock: data.stock || 0,
            imageURL: data.imageURL || "",
            categorySlug: data.categorySlug || "",
            variations:
              data.variations.length > 0 ? data.variations : [initialVariation], // Asegurar al menos una variación para edición
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
      // Modo Creación: Asegurar al menos una variación inicial
      setProductData((prev) => ({ ...prev, variations: [initialVariation] }));
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
    // Limpiar errores específicos si el usuario comienza a corregir el campo
    if (serverErrors[name]) {
      setServerErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // 4. Manejar Cambios en Variaciones
  const handleVariationChange = (index, e) => {
    const { name, value, type, checked } = e.target;
    const newVariations = [...productData.variations];

    // Convertir a número o booleano según el tipo de campo
    const finalValue =
      type === "number"
        ? parseFloat(value)
        : type === "checkbox"
        ? checked
        : value;

    newVariations[index] = {
      ...newVariations[index],
      [name]: finalValue,
    };

    setProductData((prev) => ({ ...prev, variations: newVariations }));
  };

  // 5. Añadir/Remover Variaciones
  const addVariation = () => {
    setProductData((prev) => ({
      ...prev,
      variations: [...prev.variations, initialVariation],
    }));
  };

  const removeVariation = (index) => {
    setProductData((prev) => ({
      ...prev,
      variations: prev.variations.filter((_, i) => i !== index),
    }));
  };

  // 6. Manejar la Subida de Imágenes (Placeholder - Usaremos imageURL simple por ahora)
  // ⚠️ NOTA: Si necesitas subir un archivo, esta función será más compleja.
  const handleImageUpload = (e) => {
    // Por ahora, solo actualizamos el imageURL si estás usando URLs externas
    const value = e.target.value;
    setProductData((prev) => ({ ...prev, imageURL: value }));
  };

  // 7. Manejar Envío del Formulario (POST/PUT)
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

      // En modo Edición (PUT), solo enviamos los campos que han cambiado (opcional)
      // Pero dado que nuestro validador soporta campos parciales, podemos enviar todo.

      const response = await method(url, productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Éxito: Navegar a la página de listado de productos
      navigate("/admin/products");
    } catch (err) {
      const serverResponse = err.response;
      if (
        serverResponse &&
        serverResponse.status === 400 &&
        serverResponse.data.errors
      ) {
        // Errores de validación de express-validator (400 Bad Request)
        const validationErrors = {};
        serverResponse.data.errors.forEach((err) => {
          validationErrors[err.path] = err.msg;
        });
        setServerErrors(validationErrors);
        setError("Hay errores en el formulario. Por favor, revísalos.");
      } else {
        // Otros errores (404, 500, etc.)
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            {/* Precio Base */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-700"
              >
                Precio Base (Ej. para el primer Kg/Unidad)
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
                Stock Total (Unidades o Kilos)
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

          {/* Imagen del Producto (Usando URL Simple por ahora) */}
          <div className="mt-6">
            <label
              htmlFor="imageURL"
              className="block text-sm font-medium text-gray-700"
            >
              URL de Imagen Principal
            </label>
            <input
              type="url"
              id="imageURL"
              name="imageURL"
              value={productData.imageURL}
              onChange={handleImageUpload}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
            />
            {serverErrors.imageURL && (
              <p className="text-red-500 text-xs mt-1">
                {serverErrors.imageURL}
              </p>
            )}
            {productData.imageURL && (
              <div className="mt-4 w-32 h-32 border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={productData.imageURL}
                  alt="Previsualización"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </section>

        {/* === SECCIÓN 2: VARIACIONES DINÁMICAS === */}
        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Variaciones y Unidades de Venta
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Define cómo se vende este producto (Ej: 1 Kg, 500g, 1 Pieza).
          </p>

          {productData.variations.map((variation, index) => (
            <div
              key={index}
              className="border p-4 mb-4 rounded-md bg-gray-50 relative"
            >
              <h3 className="font-medium text-gray-800 mb-3">
                Variación #{index + 1}
              </h3>

              {/* Botón de Remover Variación (si hay más de una) */}
              {productData.variations.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeVariation(index)}
                  className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Nombre de la Unidad (unitName) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Nombre Unidad (Ej: Kg, Pieza)
                  </label>
                  <input
                    type="text"
                    name="unitName"
                    required
                    value={variation.unitName}
                    onChange={(e) => handleVariationChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>

                {/* Precio de la Unidad (price) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Precio de Venta
                  </label>
                  <input
                    type="number"
                    name="price"
                    step="0.01"
                    min="0.01"
                    required
                    value={variation.price}
                    onChange={(e) => handleVariationChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>

                {/* Referencia de Unidad (unitReference) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Referencia (Ej: 1 KG, 500 GR)
                  </label>
                  <input
                    type="text"
                    name="unitReference"
                    required
                    value={variation.unitReference}
                    onChange={(e) => handleVariationChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>

                {/* Peso Aproximado (approxWeightGrams) */}
                <div>
                  <label className="block text-xs font-medium text-gray-600">
                    Peso Aprox. (Gramos)
                  </label>
                  <input
                    type="number"
                    name="approxWeightGrams"
                    min="1"
                    required
                    value={variation.approxWeightGrams}
                    onChange={(e) => handleVariationChange(index, e)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"
                  />
                </div>
              </div>

              {/* Checkbox es Unidad Entera */}
              <div className="flex items-center mt-3">
                <input
                  id={`isIntegerUnit-${index}`}
                  name="isIntegerUnit"
                  type="checkbox"
                  checked={variation.isIntegerUnit}
                  onChange={(e) => handleVariationChange(index, e)}
                  className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label
                  htmlFor={`isIntegerUnit-${index}`}
                  className="ml-2 block text-sm font-medium text-gray-700"
                >
                  Unidad Entera (No se puede vender fraccionado, ej: Pieza,
                  paquete)
                </label>
              </div>

              {/* Muestra los errores de validación de variaciones si existen */}
              {serverErrors[`variations.${index}.unitName`] && (
                <p className="text-red-500 text-xs mt-1">
                  {serverErrors[`variations.${index}.unitName`]}
                </p>
              )}
              {serverErrors[`variations.${index}.price`] && (
                <p className="text-red-500 text-xs mt-1">
                  {serverErrors[`variations.${index}.price`]}
                </p>
              )}
            </div>
          ))}

          {/* Botón para Añadir Nueva Variación */}
          <button
            type="button"
            onClick={addVariation}
            className="mt-4 flex items-center px-4 py-2 border border-red-500 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition duration-150"
          >
            ➕ Añadir Otra Variación
          </button>

          {serverErrors.variations && (
            <p className="text-red-500 text-xs mt-3">
              {serverErrors.variations}
            </p>
          )}
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
