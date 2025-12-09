import React, { createContext, useState, useContext, useEffect } from "react";


// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Proveedor (Provider) del Contexto
export const CartProvider = ({ children }) => {
  // Inicializar el estado desde localStorage (si existe)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Efecto para guardar el carrito en localStorage cada vez que cartItems cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones de Manipulación del Carrito ---

  const addToCart = (product, variation, quantity = 1) => {
    // NOTA: Asumo que product.unitType trae el valor de la DB (kilogramo, paquete, pieza)
    const lineItemId = `${product._id}-${variation._id || variation.unitLabel}`;

    const existItem = cartItems.find((x) => x.lineItemId === lineItemId);

    const itemPrice = variation.price || 0;
    const itemUnitLabel =
      variation.unitLabel || variation.unitName || product.unitName || "Unidad";
    const itemUnitReference =
      variation.unitReference || variation.unitReference || "";

    // 🟢 OBTENER unitType de la DB (asumiendo que viene en el objeto product)
    const itemUnitType = product.unitType || "kilogramo"; // Fallback seguro

    if (existItem) {
      // Si existe, actualizar solo la cantidad de esa LÍNEA
      setCartItems(
        cartItems.map((x) =>
          x.lineItemId === lineItemId
            ? {
                ...existItem,
                quantity: Number(existItem.quantity) + Number(quantity),
              }
            : x
        )
      );
    } else {
      // Si no existe, añadir la nueva línea de producto/variación

      const newItem = {
        lineItemId: lineItemId,
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: itemPrice,
        unitLabel: itemUnitLabel,
        unitReference: itemUnitReference,

        // 🟢 GUARDAMOS EL TIPO DE UNIDAD DE LA DB
        unitType: itemUnitType,

        imageURL: product.imageURL,
        quantity: quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (lineItemId) => {
    setCartItems(cartItems.filter((x) => x.lineItemId !== lineItemId));
  };

  // 🟢 FUNCIÓN CORREGIDA CON VALIDACIÓN DE ENTEROS
  const updateQuantity = (lineItemId, newQuantity) => {
    setCartItems(
      cartItems.map((x) => {
        if (x.lineItemId === lineItemId) {
          // LÓGICA CRÍTICA: Determinar si es entero
          const isInteger = x.unitType === "paquete" || x.unitType === "pieza";
          let quantityToSave = Number(newQuantity);

          if (isInteger) {
            // Forzar a entero para piezas/paquetes
            quantityToSave = parseInt(quantityToSave);

            // Asegurar el mínimo (1 para enteros)
            if (isNaN(quantityToSave) || quantityToSave < 1) {
              quantityToSave = 1;
            }
          } else {
            // Para kilogramos, asegurar el mínimo (0.5 kg)
            if (isNaN(quantityToSave) || quantityToSave < 0.5) {
              quantityToSave = 0.5;
            }
          }

          return { ...x, quantity: quantityToSave };
        }
        return x;
      })
    );
  };

  // ✅ Calcular el número total de productos únicos (líneas de pedido)
  const cartCount = cartItems.length;

  // Usar Number() en price y quantity para asegurar la suma correcta incluso al cargar de localStorage.
  const cartTotal = cartItems.reduce(
    (acc, item) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      return acc + price * quantity;
    },
    0 // Inicializar el acumulador a 0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// 3. Crear un hook personalizado para usar el carrito
export const useCart = () => {
  return useContext(CartContext);
};
