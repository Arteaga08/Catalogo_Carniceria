import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartCotext";// Asegúrate de que el import sea correcto

const WHATSAPP_NUMBER = "5216181473443"; // 👈 REEMPLAZA CON TU NÚMERO DE WHATSAPP REAL

const CartPage = () => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  // Función para manejar el cambio de cantidad (desde el input)
  const handleQuantityChange = (lineItemId, event) => {
    // ⬅️ ACEPTA lineItemId
    const rawValue = event.target.value.replace(",", ".");
    let newQuantity = parseFloat(rawValue);

    if (isNaN(newQuantity) || newQuantity < 0.5) {
      newQuantity = 0.5; // Mínimo de 0.5 Kg o la unidad mínima
    }
    updateQuantity(lineItemId, newQuantity); // ⬅️ USA lineItemId
  };

  // Función para generar el enlace de WhatsApp
  const generateWhatsAppLink = () => {
    let message = "¡Hola! Me gustaría hacer el siguiente pedido:\n\n";

    cartItems.forEach((item, index) => {
      // 1. CONVERSIÓN A NÚMERO: Aseguramos que quantity sea un número
      const quantityNum = Number(item.quantity);
      const subtotal = (item.price * quantityNum).toFixed(2);

      // 2. USO DE item.unitLabel: Usamos la unidad específica de la variación
      message += `${index + 1}. ${item.name} | ${quantityNum.toFixed(1)} ${
        item.unitLabel
      } | Subtotal: $${subtotal}\n`;
    });

    // 3. Añadir el total
    message += `\nTotal del Pedido: $${cartTotal.toFixed(2)}`;

    // 4. Codificar el mensaje para la URL
    const encodedMessage = encodeURIComponent(message);

    // 5. Crear el enlace final
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
            // Aseguramos que la cantidad sea numérica para el display
            const quantityNum = Number(item.quantity);
            const unitLabel = item.unitLabel || "Unidad"; // Usar el unitLabel de la variación
            const subtotal = (item.price * quantityNum).toFixed(2);

            return (
              <div
                // ⬅️ CAMBIO: Usar lineItemId como key para consistencia, aunque productId también funciona si es único
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
                    to={`/product/${item.slug}`}
                    className="text-lg font-semibold text-gray-800 hover:text-red-700 block truncate"
                  >
                    {item.name}
                  </Link>
                  {/* ⬅️ CAMBIO: Mostrar el unitLabel específico */}
                  <p className="text-sm text-gray-500 mt-1">
                    ${item.price.toFixed(2)} / {unitLabel}
                  </p>
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
                            item.lineItemId, // ⬅️ CAMBIO: Usar lineItemId
                            Math.max(0.5, quantityNum - 0.5)
                          )
                        }
                        disabled={quantityNum <= 0.5}
                        className={`px-3 py-1 text-base ${
                          quantityNum <= 0.5
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
                        // ⬅️ SOLUCIÓN AL ERROR: Usar quantityNum (ya es un número)
                        value={quantityNum.toFixed(1)}
                        // ⬅️ CAMBIO: Usar lineItemId en el handler
                        onChange={(e) =>
                          handleQuantityChange(item.lineItemId, e)
                        }
                        min="0.5"
                        step="0.5"
                        className="w-16 text-center p-2 text-sm focus:outline-none"
                      />
                      <button
                        type="button"
                        aria-label="Aumentar cantidad"
                        onClick={
                          () =>
                            updateQuantity(item.lineItemId, quantityNum + 0.5) // ⬅️ CAMBIO: Usar lineItemId
                        }
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-base"
                      >
                        +
                      </button>
                    </div>
                    {/* ⬅️ Mostrar el unitLabel, ya que no todos son 'Kg' */}
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
                      onClick={() => removeFromCart(item.lineItemId)} // ⬅️ CAMBIO: Usar lineItemId
                      className="text-red-500 hover:text-red-700 transition-colors p-2"
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

        {/* COLUMNA DERECHA: Resumen del Pedido (Sin cambios) */}
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
              <svg
                className="w-6 h-6 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12.0006 2.00007C6.48625 2.00007 2.00063 6.48569 2.00063 12.0001C2.00063 14.1801 2.69438 16.2051 3.8825 17.8863L2.57438 22.1863L6.91875 20.8407C8.42313 21.6882 10.1581 22.1251 12.0006 22.1251C17.5144 22.1251 22.0006 17.6388 22.0006 12.0001C22.0006 6.48569 17.5144 2.00007 12.0006 2.00007ZM17.4819 16.1469C17.2794 16.5169 16.0356 16.9207 15.6544 17.0682C15.3081 17.2144 14.9969 17.3094 14.6506 17.2088C14.3056 17.1082 13.0619 16.6669 11.6663 15.3219C10.2706 13.9757 9.47938 12.5694 9.22063 12.2157C8.96125 11.8601 9.04938 11.6138 9.30875 11.3669C9.49375 11.1813 9.71875 10.9088 9.94375 10.6432C10.1694 10.3782 10.2813 10.2319 10.4269 10.2082C10.5725 10.1844 10.665 10.1807 10.7781 10.2813C10.8906 10.3807 11.0256 10.6182 11.1719 10.8807C11.3175 11.1432 11.4306 11.4051 11.5175 11.5363C11.6044 11.6682 11.6875 11.7807 11.5863 11.9657C11.4856 12.1507 10.9669 12.9238 10.7163 13.1863C10.4656 13.4475 10.2281 13.6851 10.0519 13.8707C9.87563 14.0551 9.68063 14.2257 9.87063 14.5494C10.0606 14.8732 10.5563 15.6888 11.3094 16.3751C12.2906 17.2844 13.0781 17.5763 13.3375 17.7075C13.5963 17.8382 13.8431 17.8188 14.0381 17.6163C14.2338 17.4138 14.8094 16.7663 14.9944 16.5775C15.1794 16.3888 15.3056 16.3088 15.4819 16.3407C15.6581 16.3725 17.1856 17.1563 17.5163 17.3207C17.8469 17.4851 18.0675 17.5763 18.1556 17.6538C18.2438 17.7313 18.2438 18.0907 18.0406 18.4607C17.8375 18.8307 17.3375 19.3307 17.0675 19.5888C16.8006 19.8457 16.5169 19.8938 16.0856 19.9294C15.6556 19.9651 14.9819 19.8669 12.8719 19.0438C9.5775 17.7794 7.42063 14.3944 7.24563 14.1207C7.07063 13.8469 6.8119 13.4888 6.8119 13.0475C6.8119 12.6057 6.94063 12.3957 7.15125 12.1857C7.36125 11.9757 7.74125 11.7588 7.9669 11.5332C8.1919 11.3075 8.3375 11.1763 8.4419 10.9894C8.5463 10.8038 8.49063 10.6644 8.4025 10.4857C8.31438 10.3069 8.16375 9.9475 8.01813 9.7119C7.8725 9.47569 7.72875 9.1763 7.64063 9.0069C7.5525 8.8375 7.47625 8.7188 7.64063 8.5775C7.7925 8.4357 8.08188 8.3582 8.27813 8.3244C8.47375 8.29007 8.70563 8.2869 8.92063 8.2888C9.13563 8.2907 9.3825 8.2894 9.5375 8.5138C9.70063 8.7369 9.9575 9.2782 10.055 9.47569C10.1525 9.6738 10.1981 9.7119 10.3031 9.8588C10.4075 10.0057 10.4831 10.0988 10.4269 9.9807L10.7706 10.3044C10.8419 10.4357 10.9875 10.6207 11.1331 10.8057C11.2787 10.9907 11.4244 11.1757 11.5175 11.3607C11.6106 11.5457 11.7231 11.6669 11.6706 11.7763C11.6181 11.8857 11.2856 12.4357 10.9256 12.9863C10.5656 13.5369 10.2781 13.9782 10.2281 14.0788C10.1781 14.1794 10.1656 14.3644 10.2706 14.5094C10.3756 14.6563 10.5906 14.8601 10.7956 15.0644C11.0006 15.2682 11.2056 15.4725 11.3906 15.6575C11.5756 15.8425 11.7519 16.0282 11.9163 16.1469C12.0806 16.2657 12.3056 16.3244 12.4906 16.2313C12.6756 16.1382 13.2356 15.8582 13.7856 15.5488C14.3356 15.2394 14.7863 15.0444 14.9963 14.9863C15.2063 14.9282 15.4094 14.9238 15.5856 15.0169C15.7619 15.1094 16.0944 15.4544 16.4263 15.7994C16.7581 16.1444 17.0906 16.4888 17.2956 16.6938C17.4994 16.8975 17.6556 16.9694 17.7663 16.9388C17.8763 16.9082 18.0675 16.5994 17.8463 16.1469L17.4819 16.1469Z" />
              </svg>
              Finalizar Pedido por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
