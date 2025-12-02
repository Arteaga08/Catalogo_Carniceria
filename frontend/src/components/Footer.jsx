// src/components/Footer.jsx (MODIFICADO)

import React from "react";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from "react-icons/fa";

const Footer = () => {
  // Definición simple de enlaces y contacto
  const companyInfo = {
    name: "Carnicería Meño",
    slogan: "La carne más fresca a tu mesa.",
    year: new Date().getFullYear(),
    whatsapp: "526181473443", // Tu número de WhatsApp
    facebookUrl: "https://www.facebook.com/tu_pagina_de_facebook",
    instagramUrl: "https://www.instagram.com/tu_usuario_de_instagram",
    tiktokUrl: "https://www.tiktok.com/tu_usuario_de_instagram",
  };

  const defaultWhatsappMessage =
    "Hola, me gustaría hacer una consulta sobre sus productos y servicios.";

  const sections = [
    { name: "Inicio", path: "/" },
    { name: "Catálogo", path: "/products" },
    // Aquí podrías agregar otras rutas públicas como 'Sobre Nosotros'
  ];

  // Agregamos una nueva sección de soporte o enlaces internos
  const supportLinks = [
    { name: "Contacto", path: "/contact" },
    // Aquí puedes añadir rutas como 'Preguntas Frecuentes'
  ];

  return (
    <footer className="bg-gray-900 text-white mt-12 pt-10 pb-6">
      <div className="container mx-auto px-4">
        {/* Grid principal */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-6">
          {/* Columna 1: Logo e Información */}
          <div>
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

          {/* 🎯 Columna 3: SOPORTE Y ACCESO ADMIN (NUEVA SECCIÓN) */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Soporte y Acceso</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-300 hover:text-red-500 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {/* ENLACE DE LOGIN/ADMINISTRACIÓN */}
              <li className="pt-2">
                <Link
                  to="/login"
                  className="text-sm text-red-500 hover:text-red-400 transition-colors font-bold uppercase"
                >
                  Panel de Administración
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto y Redes Sociales */}
          <div>
            <h4 className="text-lg font-semibold mb-3">Contacto</h4>
            <p className="text-sm text-gray-300 mb-2">Pedidos y consultas:</p>

            <a
              href={`https://wa.me/${
                companyInfo.whatsapp
              }?text=${encodeURIComponent(defaultWhatsappMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-red-500 hover:text-red-400 transition-colors font-medium mb-4"
            >
              <FaWhatsapp className="w-5 h-5 mr-2" />
              {companyInfo.whatsapp}
            </a>

            <div className="flex items-center mt-4 space-x-4">
              <a
                href={companyInfo.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-500 transition-colors"
                aria-label="Ir a Facebook"
              >
                <FaFacebook className="w-6 h-6" />
              </a>
              <a
                href={companyInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-pink-500 transition-colors"
                aria-label="Ir a Instagram"
              >
                <FaInstagram className="w-6 h-6" />
              </a>
              <a
                href={companyInfo.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Ir a TikTok"
              >
                <FaTiktok className="w-6 h-6" />
              </a>
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
