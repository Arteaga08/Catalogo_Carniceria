// Archivo: frontend/src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import HomePage from "./pages/HomePage.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";

function App() {
  return (
    // BrowserRouter: Envuelve toda la aplicación para habilitar la navegación
    <BrowserRouter>
      <Header /> {/* Componente visible en todas las rutas */}
      {/* Contenedor principal para centrar el contenido */}
      <main className="container mx-auto px-4 py-8">
        {/* Routes: Aquí definimos las URL y los componentes asociados */}
        <Routes>
          {/* Ruta principal: Muestra el componente HomePage */}
          <Route path="/" element={<HomePage />} />

          {/* Ruta para el detalle del producto: Usa el parámetro ':slug' en la URL */}
          <Route path="/products/:slug" element={<ProductDetails />} />

          <Route path="/products/category/:slug" element={<HomePage />} />

          {/* Ruta de ejemplo para mostrar la página "No Encontrada" (404) */}
          <Route
            path="*"
            element={
              <h1 className="text-4xl text-red-600">
                404 - Página no encontrada
              </h1>
            }
          />
        </Routes>
      </main>
      <Footer /> {/* Componente visible en todas las rutas */}
    </BrowserRouter>
  );
}

export default App;
