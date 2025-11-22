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

  // Ahora recibe el objeto de la variación para manejar diferentes presentaciones
  const addToCart = (product, variation, quantity = 1) => {
    // Generar un ID ÚNICO para la línea del carrito (combinando producto y variación)
    // Asumimos que la variación tiene un _id o usamos el unitLabel como fallback para productos simples
    const lineItemId = `${product._id}-${variation._id || variation.unitLabel}`;

    // Buscar si la LÍNEA específica (producto + variación) ya existe en el carrito
    const existItem = cartItems.find((x) => x.lineItemId === lineItemId);

    // Obtener datos de la variación
    const itemPrice = variation.price || 0;
    const itemUnitLabel = variation.unitLabel || "Unidad";
    const itemUnitReference = variation.unitReference || "";

    if (existItem) {
      // Si existe, actualizar solo la cantidad de esa LÍNEA
      setCartItems(
        cartItems.map((x) =>
          x.lineItemId === lineItemId
            ? { ...existItem, quantity: existItem.quantity + quantity }
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
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (lineItemId) => {
    // Ahora usa lineItemId
    setCartItems(cartItems.filter((x) => x.lineItemId !== lineItemId));
  };

  const updateQuantity = (lineItemId, newQuantity) => {
    // Ahora usa lineItemId
    setCartItems(
      cartItems.map((x) =>
        x.lineItemId === lineItemId ? { ...x, quantity: newQuantity } : x
      )
    );
  };

  // ✅ Calcular el número total de productos únicos (líneas de pedido)
  const cartCount = cartItems.length;

  // Calcular el subtotal (se mantiene igual)
  const cartTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
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
