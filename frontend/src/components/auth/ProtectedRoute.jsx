// src/components/auth/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext"; // Ajusta la ruta si es necesario

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    // Podrías devolver un spinner o null si el AuthProvider ya lo maneja
    return null;
  }

  if (!isAuthenticated) {
    // No logueado: redirige a la página de inicio de sesión
    return <Navigate to="/login" replace />;
  }

  // Verificar el rol del usuario (si el token decodificado contiene el campo 'role')
  // Nota: Esto es solo para la UX, la seguridad real está en el backend.
  if (user && !allowedRoles.includes(user.role)) {
    // Logueado pero sin rol permitido: redirige a la página principal
    return <Navigate to="/" replace />;
  }

  // Autenticado y Autorizado
  return children;
};

export default ProtectedRoute;
