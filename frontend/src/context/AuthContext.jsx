import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Asegúrate de que esta librería está instalada

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Ahora leemos la clave "token" directamente, según tu implementación
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Define la URL de la API de forma centralizada (ajusta el puerto si es necesario)
  const API_BASE_URL = "http://localhost:5001/api";

  // 1. Efecto de inicialización: Lee el token al cargar la app.
  useEffect(() => {
    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        // Verifica expiración del token (campo 'exp' en segundos)
        if (decodedUser.exp * 1000 < Date.now()) {
          console.log("Token expirado. Cerrando sesión automáticamente.");
          logout();
          return;
        }

        // Si el token es válido:
        setUser(decodedUser);
        // Configura el header de Autorización por defecto para todas las peticiones
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        // Esto captura errores de decodificación o formatos inválidos
        console.error("Token inválido o expirado:", error);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  // 2. Función de Login
  const login = async (email, password) => {
    const URL_LOGIN = `${API_BASE_URL}/users/login`;
    console.log("Intentando login en:", URL_LOGIN); // Log de depuración

    try {
      const response = await axios.post(URL_LOGIN, { email, password });

      // El backend devuelve { _id, name, email, token, ... }
      const newToken = response.data.token;

      // 🛑 Guarda la cadena del token directamente bajo la clave "token"
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
    // Elimina el header de Autorización para todas las peticiones futuras
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
