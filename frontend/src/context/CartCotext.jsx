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

  // --- Funciones de Manipulación del Carrito ---

  const addToCart = (product, quantity = 1) => {
    // Buscar si el producto ya existe en el carrito
    const existItem = cartItems.find((x) => x.productId === product._id);

    // Obtener el precio, considerando la estructura con variaciones
    const itemPrice =
      product.price ||
      (Array.isArray(product.variations) && product.variations[0]?.price) ||
      0;

    if (existItem) {
      // Si existe, actualizar solo la cantidad
      setCartItems(
        cartItems.map((x) =>
          x.productId === product._id
            ? { ...existItem, quantity: existItem.quantity + quantity }
            : x
        )
      );
    } else {
      // Si no existe, añadir el nuevo producto
      const newItem = {
        productId: product._id,
        slug: product.slug,
        name: product.name,
        price: itemPrice, // Usar el precio ya resuelto
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

  // Calcular el número total de artículos en el carrito
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Calcular el subtotal
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
