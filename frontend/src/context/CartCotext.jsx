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
    const lineItemId = `${product._id}-${variation._id || variation.unitLabel}`;

    const existItem = cartItems.find((x) => x.lineItemId === lineItemId);

    const itemPrice = variation.price || 0;
    const itemUnitLabel = variation.unitLabel || "Unidad";
    const itemUnitReference = variation.unitReference || "";

    if (existItem) {
      // Si existe, actualizar solo la cantidad de esa LÍNEA
      setCartItems(
        cartItems.map((x) =>
          x.lineItemId === lineItemId
            ? {
                ...existItem,
                quantity: Number(existItem.quantity) + Number(quantity),
              } // Aseguramos que la suma es numérica
            : x
        )
      );
    } else {
      // Si no existe, añadir la nueva línea de producto/variación
      const newItem = {
        lineItemId: lineItemId, // ID ÚNICO
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: itemPrice,
        unitLabel: itemUnitLabel,
        unitReference: itemUnitReference,
        imageURL: product.imageURL,
        quantity: quantity, // Usamos la cantidad inicial
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (lineItemId) => {
    setCartItems(cartItems.filter((x) => x.lineItemId !== lineItemId));
  };

  const updateQuantity = (lineItemId, newQuantity) => {
    // Aseguramos que newQuantity se almacene como número (aunque parseFloat se use en el componente)
    setCartItems(
      cartItems.map((x) =>
        x.lineItemId === lineItemId
          ? { ...x, quantity: Number(newQuantity) }
          : x
      )
    );
  };

  // ✅ Calcular el número total de productos únicos (líneas de pedido)
  const cartCount = cartItems.length;

  // ⬅️ ¡CORRECCIÓN APLICADA AQUÍ!
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
