import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchProductBySlug } from "../api/apiService";
import { useCart } from "../context/CartCotext"; // Asegúrate que la ruta sea CartContext (no CartCotext)
import { getAbsoluteImageUrl } from "../api/apiService";

const ProductDetailPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { slug } = useParams();
  const { addToCart } = useCart();

  // Estado para manejar la cantidad seleccionada. Se inicializa a 1 por defecto.
  const [quantity, setQuantity] = useState(1);
  // Estado intermedio para el input (texto).
  const [quantityInput, setQuantityInput] = useState("1.0");

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setError("Slug de producto no encontrado en la URL.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await fetchProductBySlug(slug);

        if (data && data.name) {
          setProduct(data);
          console.log("Producto cargado con éxito:", data.name);
          setQuantity(1);
        } else {
          setError("El producto no existe o la respuesta fue vacía.");
        }
      } catch (err) {
        console.error("Fallo al cargar el producto:", err);
        setError("Error de red o del servidor al obtener el producto.");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // =====================================================================
  // 🟢 1. LÓGICA DE UNIDAD Y PRECIO (SIMPLIFICADA)
  // =====================================================================

  // Leemos directamente 'unitType' del producto. Si no existe, fallback a "Kg".
  const productUnitLabel = product?.unitType || "Kg";

  // Leemos directamente 'price'.
  const displayPrice = product?.price || 0;

  // =====================================================================
  // 🟢 2. DETECCIÓN DE ENTEROS (BASED EN TUS NUEVOS VALORES)
  // =====================================================================

  // Si es "Paquete" o "Pieza", forzamos enteros. Si es "Kg", permitimos decimales.
  const isInteger =
    productUnitLabel === "Paquete" || productUnitLabel === "Pieza";

  // Configuración del input numérico
  const stepVal = isInteger ? 1 : 0.5; // Salto de 1 en 1 para enteros, 0.5 para Kg
  const minVal = isInteger ? 1 : 0.5; // Mínimo 1 para enteros, 0.5 (medio kilo) para Kg
  const decimals = isInteger ? 0 : 1; // Sin decimales visuales para enteros

  // =====================================================================

  // Sincronizar el input textual con la cantidad cuando cambien quantity o decimals
  useEffect(() => {
    setQuantityInput(Number(quantity).toFixed(decimals));
  }, [quantity, decimals]);

  // =====================================================================
  // 🟢 3. AÑADIR AL CARRITO (LIMPIEZA DE VARIACIONES)
  // =====================================================================
  const handleAddToCart = () => {
    if (!product || quantity < minVal) {
      alert(
        `Por favor, selecciona una cantidad válida (mínimo ${minVal} ${productUnitLabel}).`
      );
      return;
    }

    // Creamos el objeto limpio para el carrito
    // Ya no dependemos de "variations" porque tu modelo es plano ahora.
    const itemToAdd = {
      _id: product._id,
      price: displayPrice,
      unitLabel: productUnitLabel,
      // Guardamos si es entero para que el carrito sepa cómo comportarse al editar
      isIntegerUnit: isInteger,
      // Pasamos el resto de datos del producto necesarios
      name: product.name,
      slug: product.slug,
      imageURL: product.imageURL,
    };

    // Nota: addToCart en tu context probablemente espera (product, variation, quantity)
    // Como ya no usas variaciones, pasamos 'itemToAdd' como segundo argumento actuando como la "variación seleccionada"
    // o adaptamos según tu CartContext. Asumiremos que el segundo argumento son los detalles extra.

    addToCart(product, itemToAdd, quantity);

    alert(
      `¡Listo! Se agregaron ${quantity.toFixed(
        decimals
      )} ${productUnitLabel} de "${product.name}" al carrito.`
    );
  };

  // --- Renderizado Condicional ---

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-red-700">
          Cargando detalles del producto...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-xl font-semibold text-red-600">
          Error: {error || "No se pudo cargar la información del producto."}
        </p>
        <p className="text-gray-500">
          Intenta navegar desde la página principal.
        </p>
      </div>
    );
  }

  // --- Renderizado del Detalle del Producto ---

  const imageUrl = getAbsoluteImageUrl(product.imageURL);

  const rawCategorySlug = product.categorySlug || product.category;
  const displayCategory = rawCategorySlug
    ? rawCategorySlug.replace(/-/g, " ").toUpperCase()
    : "CATEGORÍA";

  const totalEstimado = displayPrice ? displayPrice * quantity : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Columna de Imagen */}
          <div className="md:w-1/2 p-4">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg shadow-md"
            />
          </div>

          {/* Columna de Detalle */}
          <div className="md:w-1/2 p-6 md:p-10">
            <span className="text-sm font-bold uppercase text-red-600 bg-red-100 px-3 py-1 rounded-full">
              {displayCategory}
            </span>
            <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
              {product.name}
            </h1>

            <p className="text-3xl font-black text-gray-800 mb-2">
              Precio:{" "}
              {displayPrice ? `$${Number(displayPrice).toFixed(2)}` : "N/A"}
              <span className="text-base font-normal text-gray-500">
                {" "}
                / {productUnitLabel}
              </span>
            </p>

            <hr className="my-6" />

            {/* Selector de Cantidad */}
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              Seleccionar Cantidad
            </h3>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
                <button
                  type="button"
                  aria-label="Disminuir cantidad"
                  onClick={() => {
                    const next = Math.max(
                      minVal,
                      +(quantity - stepVal).toFixed(decimals)
                    );
                    setQuantity(next);
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  −
                </button>
                <input
                  type="number"
                  inputMode={isInteger ? "numeric" : "decimal"}
                  pattern={isInteger ? "[0-9]*" : "[0-9]*([.,][0-9]+)?"}
                  value={quantityInput}
                  onChange={(e) => {
                    setQuantityInput(e.target.value);
                  }}
                  onBlur={(e) => {
                    const raw = e.target.value.replace(",", ".");
                    const parsed = parseFloat(raw);
                    let next;
                    if (isNaN(parsed)) {
                      next = minVal;
                    } else {
                      if (isInteger) {
                        next = Math.max(minVal, Math.round(parsed));
                      } else {
                        next = Math.max(minVal, +parsed.toFixed(decimals));
                      }
                    }
                    setQuantity(next);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                  min={minVal}
                  step={stepVal}
                  className="w-28 text-center p-3 text-xl font-semibold focus:border-red-500 focus:outline-none"
                  disabled={displayPrice === 0}
                />
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={() => {
                    const next = +(quantity + stepVal).toFixed(decimals);
                    setQuantity(next);
                  }}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                >
                  +
                </button>
              </div>
              <span className="text-xl text-gray-700 font-semibold">
                {productUnitLabel}
              </span>
            </div>

            {/* Costo Total Estimado */}
            <p className="text-3xl font-black text-red-700 mb-8">
              Total: ${totalEstimado.toFixed(2)}
            </p>

            {/* Descripción */}
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Descripción
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description ||
                "Este producto no tiene una descripción detallada disponible."}
            </p>

            {/* Botón de Añadir al Carrito */}
            <button
              className="cursor-pointer w-full md:w-auto bg-red-700 text-white text-xl py-3 px-8 rounded-xl font-bold hover:bg-red-800 transition-colors shadow-lg disabled:bg-gray-400"
              onClick={handleAddToCart}
              disabled={displayPrice === 0 || quantity < minVal}
            >
              🛒 Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
