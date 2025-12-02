// src/pages/LoginPage.jsx (CORREGIDO)
import React, { useState, useEffect } from "react"; // 👈 IMPORTAR useEffect
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 🎯 CORRECCIÓN CLAVE: Usar useEffect para la redirección inicial
  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir si el usuario ya está autenticado (evita el warning)
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]); // Dependencias: se ejecuta si el estado de auth cambia

  // Si ya está autenticado, simplemente renderizamos null mientras useEffect redirige.
  if (isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);

    try {
      await login(email, password);
      // La redirección después del login exitoso ocurre automáticamente
      // porque 'isAuthenticated' cambia a true, disparando el useEffect.
      // Ya no necesitamos llamar a navigate() aquí.
    } catch (err) {
      const errorMessage =
        typeof err === "string"
          ? err
          : "Credenciales inválidas o error de red.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      {/* ... (el resto del código del formulario es el mismo) ... */}
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center">
          Iniciar Sesión
        </h2>
        <p className="text-center text-sm text-gray-600">
          Accede al panel de administración de la carnicería.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div
              className="p-3 text-sm text-red-700 bg-red-100 rounded-lg"
              role="alert"
            >
              {error}
            </div>
          )}

          {/* Campo Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="admin@ejemplo.com"
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm"
              placeholder="Ingresa tu contraseña"
            />
          </div>

          {/* Botón de Submit */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              }`}
            >
              {loading ? "Cargando..." : "Acceder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
