// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 1. Efecto de inicialización: Lee el token al cargar la app.
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        // Verifica expiración del token (si el backend lo incluye)
        if (decodedUser.exp * 1000 < Date.now()) {
          logout();
          return;
        }

        setUser(decodedUser);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        console.error("Token inválido o expirado:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // 2. Función de Login
  const login = async (email, password) => {
    // ⚠️ Usa la URL de tu backend
    const URL_LOGIN = "http://localhost:5001/api/users/login";

    try {
      const response = await axios.post(URL_LOGIN, { email, password });
      const newToken = response.data.token;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      // El useEffect anterior se encargará de decodificar y setear el usuario

      return response.data;
    } catch (error) {
      // Devuelve el mensaje de error para mostrarlo en el formulario de login
      throw error.response?.data?.message || "Error de conexión";
    }
  };

  // 3. Función de Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Cargando sesión...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
