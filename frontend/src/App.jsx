import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";

import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/CartCotext";
import ScrollToTop from "./components/ScrollToTop";
import ProductDetailPage from "./pages/ProductPage";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";
import LoginPage from "./pages/LoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ProductListPage from "./pages/admin/products/ProductListPage";
import CategoryListPage from "./pages/admin/categories/CategoryListPage";

// Asegúrate de que este archivo exista: frontend/src/context/CartContext.jsx

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <AuthProvider>
        <CartProvider>
          <Header />
          <main className="min-h-screen">
            <Routes>
              {/* Rutas Publicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/products/category/:slug" element={<HomePage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Rutas protegidas. Administrador */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={["admin", "editor"]}>
                    <AdminLayout />{" "}
                    {/* AdminLayout contendrá el Sidebar y Main Area */}
                  </ProtectedRoute>
                }
              ></Route>

              {/* Rutas Hijas de /admin */}
              <Route index element={<AdminDashboardPage />} />
              <Route path="products" element={<ProductListPage />} />
              <Route path="categories" element={<CategoryListPage />} />
              {/* Añadiremos los formularios de new/edit aquí más adelante */}
            </Routes>
          </main>
          <Footer />
        </CartProvider>{" "}
        {/* 👈 CERRAR CartProvider */}
      </AuthProvider>
    </Router>
  );
};

export default App;
