import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";

import { CartProvider } from "./context/CartCotext";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetailPage from "./pages/ProductPage";
// 👈 IMPORTAR el CartProvider

// Asegúrate de que este archivo exista: frontend/src/context/CartContext.jsx

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <Header />
        <main className="min-h-screen">
          <Routes>
            {/* Rutas existentes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/products/category/:slug" element={<HomePage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Futuras rutas del carrito (por ejemplo, /cart) */}
            {/* <Route path="/cart" element={<CartPage />} /> */}
          </Routes>
        </main>
        <Footer />
      </CartProvider>{" "}
      {/* 👈 CERRAR CartProvider */}
    </Router>
  );
};

export default App;
