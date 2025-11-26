import React from "react";
import { Link } from "react-router-dom";

// ✅ Estos imports ya los tienes, ¡genial!
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  // Definición simple de enlaces y contacto
  const companyInfo = {
    name: "Carnicería Meño",
    slogan: "La carne más fresca a tu mesa.",
    year: new Date().getFullYear(),
    whatsapp: "526181473443", // Tu número de WhatsApp
    // ⚠️ Añade aquí tus URLs de Facebook e Instagram
    facebookUrl: "https://www.facebook.com/tu_pagina_de_facebook", // ¡REEMPLAZA con tu URL real!
    instagramUrl: "https://www.instagram.com/tu_usuario_de_instagram",
    tiktokUrl: "https://www.tiktok.com/tu_usuario_de_instagram"
  };

  
  const defaultWhatsappMessage = "Hola, me gustaría hacer una consulta sobre sus productos y servicios.";

  const sections = [
    { name: "Inicio", path: "/" },
    { name: "Catálogo", path: "/products" },
    // Puedes agregar más rutas aquí si las tienes, como 'Sobre Nosotros'
  ];

  return (
    <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Grid principal para desktop, stack para mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-6">
          {/* Columna 1: Logo e Información */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-red-500 mb-2">
              {companyInfo.name}
            </h3>
            <p className="text-sm text-gray-400">{companyInfo.slogan}</p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Secciones</h4>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.name}>
                  <Link
                    to={section.path}
                    className="text-sm text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Contacto y Soporte */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contacto</h4>
            <p className="text-sm text-gray-300 mb-2">Pedidos y consultas:</p>

            {/* ✅ Aquí reemplazamos el SVG con FaWhatsapp */}
            <a
              href={`https://wa.me/${companyInfo.whatsapp}?text=${encodeURIComponent(defaultWhatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors font-medium mb-4"
            >
              <FaWhatsapp className="w-5 h-5 mr-2" /> {/* Usamos FaWhatsapp */}
              {companyInfo.whatsapp}
            </a>
            
            {/* 🚨 NUEVA SECCIÓN: Redes Sociales */}
            <div className="flex items-center mt-4 space-x-4">
              {/* Enlace de Facebook */}
              <a
                href={companyInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors" // Color de hover para Facebook
                aria-label="Ir a Facebook"
              >
                <FaFacebook className="w-6 h-6" /> {/* Icono de Facebook */}
              </a>

              {/* Enlace de Instagram */}
              <a
                href={companyInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors" // Color de hover para Instagram
                aria-label="Ir a Instagram"
              >
                <FaInstagram className="w-6 h-6" /> {/* Icono de Instagram */}
              </a>
              <a
                href={companyInfo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-black transition-colors" // Color de hover para Instagram
                aria-label="Ir a Instagram"
              >
                <FaTiktok className="w-6 h-6" /> {/* Icono de Instagram */}
              </a>
              {/* Puedes añadir más iconos aquí si lo deseas */}
            </div>

          </div>
        </div>

        {/* Derechos de Autor */}
        <div className="text-center text-gray-500 text-sm">
          &copy; {companyInfo.year} {companyInfo.name}. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;