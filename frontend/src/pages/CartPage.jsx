import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartCotext";

import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "5216182991059"; // 👈 REEMPLAZA CON TU NÚMERO DE WHATSAPP REAL

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  // Función para manejar el cambio de cantidad (desde el input)
  const handleQuantityChange = (lineItemId, event) => {
    const item = cartItems.find((x) => x.lineItemId === lineItemId);
    if (!item) return;

    // LÓGICA DE CONTROL DE UNIDADES:
    const isInteger = item.isIntegerUnit || false;
    // La cantidad mínima es 1 para enteros y 0.5 para decimales por peso.
    const minQuantity = isInteger ? 1 : 0.5;

    // 1. Limpia y parsea el valor del input.
    // Reemplaza comas por puntos para compatibilidad con parseFloat.
    const rawValue = event.target.value.replace(",", ".");
    let newQuantity = parseFloat(rawValue);

    // 2. Validaciones iniciales
    if (isNaN(newQuantity) || newQuantity < minQuantity) {
      newQuantity = minQuantity;
    }

    // 3. Redondeo CONDICIONAL
    if (isInteger) {
      // Si es entero (Paquete, Pieza), forzamos el redondeo al entero más cercano
      newQuantity = Math.round(newQuantity);
    }
    // ------------------------------------

    // 4. Actualizar el estado
    updateQuantity(lineItemId, newQuantity);
  };

  // Función para generar el enlace de WhatsApp
  const generateWhatsAppLink = () => {
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";

    cartItems.forEach((item, index) => {
      const quantityNum = Number(item.quantity);
      const subtotal = (item.price * quantityNum).toFixed(2);

      // Determinar los decimales para el display del mensaje
      const isInteger = item.isIntegerUnit || false;
      const fixedDecimals = isInteger ? 0 : 1;

      // Usamos toFixed(fixedDecimals) para mostrar la cantidad correctamente
      message += `${index + 1}. ${item.name} | ${quantityNum.toFixed(
        fixedDecimals
      )} ${item.unitLabel} | Subtotal: $${subtotal}\n`;
    });

    message += `\nTotal del Pedido: $${cartTotal.toFixed(2)}`;
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
  };

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          🛒 Tu Carrito está Vacío
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Parece que aún no has agregado productos frescos a tu pedido.
        </p>
        <Link
          to="/"
          className="bg-red-700 text-white text-xl py-3 px-8 rounded-lg font-bold hover:bg-red-800 transition-colors shadow-lg"
        >
          Ver Catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">
        Carrito de Compras
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* COLUMNA IZQUIERDA: Lista de Artículos */}
        <div className="lg:w-2/3 space-y-4">
          {cartItems.map((item) => {
            const quantityNum = Number(item.quantity);
            // Preferir unitLabel; si no existe, usar unitName
            const unitLabel = item.unitLabel || item.unitName || "Unidad";

            // LÓGICA DINÁMICA: Determinar los parámetros por ítem
            const isInteger = item.isIntegerUnit || false;
            const stepValue = isInteger ? 1 : 0.5;
            const minQuantity = isInteger ? 1 : 0.5;
            const fixedDecimals = isInteger ? 0 : 1;

            const subtotal = (item.price * quantityNum).toFixed(2);

            return (
              <div
                key={item.lineItemId}
                className="bg-white shadow-lg rounded-lg p-4 grid grid-cols-1 sm:grid-cols-[72px_1fr_auto] gap-4 items-center"
              >
                {/* Imagen */}
                <div className="flex items-center justify-center">
                  <img
                    src={
                      item.imageURL || "https://via.placeholder.com/80?text=🥩"
                    }
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                </div>

                {/* Detalles */}
                <div className="min-w-0">
                  <Link
                    to={`/products/${item.slug}`}
                    className="text-lg font-semibold text-gray-800 hover:text-red-700 block truncate"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    ${item.price.toFixed(2)} / {unitLabel}
                  </p>
                  {/* Asegúrate de que item.description exista antes de mostrar */}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Controles y subtotal */}
                <div className="flex flex-col items-end justify-center space-y-2">
                  <div className="flex items-center">
                    <div className="flex items-center border rounded overflow-hidden">
                      <button
                        type="button"
                        aria-label="Disminuir cantidad"
                        onClick={() =>
                          updateQuantity(
                            item.lineItemId,
                            // Asegura un mínimo y ajusta por stepValue
                            Math.max(
                              minQuantity,
                              +(quantityNum - stepValue).toFixed(fixedDecimals)
                            )
                          )
                        }
                        disabled={quantityNum <= minQuantity}
                        className={`cursor-pointer px-3 py-1 text-base ${
                          quantityNum <= minQuantity
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        −
                      </button>
                      <input
                        type="number"
                        inputMode="decimal"
                        pattern="[0-9]*([.,][0-9]+)?"
                        // Usa fixedDecimals para 0 o 1 decimal en el display
                        value={quantityNum.toFixed(fixedDecimals)}
                        onChange={(e) =>
                          handleQuantityChange(item.lineItemId, e)
                        }
                        // Usa minQuantity y stepValue para el input nativo
                        min={minQuantity}
                        step={stepValue}
                        className="w-16 text-center p-2 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={() =>
                          // Ajusta por stepValue y fixedDecimals
                          updateQuantity(
                            item.lineItemId,
                            +(quantityNum + stepValue).toFixed(fixedDecimals)
                          )
                        }
                        className="cursor-pointer px-3 py-1 bg-gray-100 hover:bg-gray-200 text-base"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm ml-2 text-gray-600">
                      {unitLabel}
                    </span>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${subtotal}
                    </p>
                  </div>

                  <div>
                    <button
                      onClick={() => removeFromCart(item.lineItemId)}
                      className="cursor-pointer text-red-500 hover:text-red-700 transition-colors p-2"
                      aria-label={`Eliminar ${item.name}`}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* COLUMNA DERECHA: Resumen del Pedido */}
        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-xl sticky top-24">
            <h2 className="text-2xl font-bold mb-4">Resumen de la Compra</h2>

            <div className="flex justify-between text-lg font-semibold border-t pt-4">
              <span>Total a Pagar:</span>
              <span className="text-red-700">${cartTotal.toFixed(2)}</span>
            </div>

            <p className="text-sm text-gray-500 mt-2">
              El total no incluye costos de envío. Los detalles se coordinarán
              por WhatsApp.
            </p>

            <hr className="my-5" />

            {/* Botón de Finalizar Pedido por WhatsApp */}
            <a
              href={generateWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center bg-green-600 text-white text-xl py-3 rounded-lg font-bold hover:bg-green-700 transition-colors shadow-md"
            >
              <FaWhatsapp className="w-6 h-6 mr-2" />
              Finalizar Pedido por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
