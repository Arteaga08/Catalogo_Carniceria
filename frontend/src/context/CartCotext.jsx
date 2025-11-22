// Archivo: frontend/src/context/CartContext.jsx

import React, { createContext, useState, useContext, useEffect } from "react";

// 1. Crear el Contexto
const CartContext = createContext();

// 2. Crear el Proveedor (Provider) del Contexto
export const CartProvider = ({ children }) => {
  // Estado inicial del carrito: un arreglo de objetos de carrito
  // Inicializar el estado desde localStorage (si existe)
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem("cartItems");
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Efecto para guardar el carrito en localStorage cada vez que cartItems cambia
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // --- Funciones de Manipulación del Carrito (sin cambios) ---

  const addToCart = (product, quantity = 1) => {
    // ... (lógica de addToCart se mantiene igual) ...
    const existItem = cartItems.find((x) => x.productId === product._id);
    const itemPrice =
      product.price ||
      (Array.isArray(product.variations) && product.variations[0]?.price) ||
      0;

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.productId === product._id
            ? { ...existItem, quantity: existItem.quantity + quantity }
            : x
        )
      );
    } else {
      const newItem = {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: itemPrice,
        imageURL: product.imageURL,
        quantity,
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter((x) => x.productId !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    setCartItems(
      cartItems.map((x) =>
        x.productId === productId ? { ...x, quantity: newQuantity } : x
      )
    );
  };

  // ⬅️ MODIFICACIÓN CLAVE AQUÍ: Contar la longitud del array
  // OLD: const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  // ✅ NEW: Contar el número de artículos (líneas de pedido)
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
