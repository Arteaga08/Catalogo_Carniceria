import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import Category from "./models/categoryModel.js";
import Product from "./models/ProductModel.js";
import User from "./models/userModel.js";

import users from "./data/users.js";

import connectDB from "./config/db.js";

// --- CONFIGURACIÓN Y CONEXIÓN ---
dotenv.config();
const MONGODB_URI = process.env.MONGO_URI;

// Usamos la función de conexión que ya creamos.
connectDB();

// --- DATOS DE PRUEBA (DATA) ---

const categories = {
  CARNICERÍA: [
    {
      name: "Carne de Res",
      slug: "carne-de-res",
      imageURL: "/uploads/images/Carniceria/CarneRes/New-york.png", // 🟢 Modificado
      order: 1,
    },
    {
      name: "Carne de Puerco",
      slug: "carne-de-puerco",
      imageURL:
        "/uploads/images/Carniceria/CarneCerdo/chuleta-cerdo-ahumada.png", // 🟢 Modificado
      order: 2,
    },
    {
      name: "Pollo",
      slug: "pollo",
      imageURL: "/uploads/images/Carniceria/Pollo/pollo-pechuga.png", // 🟢 Modificado
      order: 3,
    },
    {
      name: "Procesado",
      slug: "procesado",
      imageURL: "/uploads/images/Congelado/Carne-para-hamburguesa-Burgy.jpg", // 🟢 Modificado
      order: 4,
    },
  ],
  "CORTES PARRILLEROS": [
    {
      name: "Cortes para Asar",
      slug: "cortes-para-asar",
      imageURL: "/uploads/images/Carniceria/CarneRes/Tomahawk.png", // 🟢 Modificado
      order: 1,
    },
    {
      name: "Cortes Premium",
      slug: "cortes-premium",
      imageURL: "/uploads/images/Parrilleros/cortes-premium.png", // 🟢 Modificado
      order: 2,
    },
  ],
  PAQUETES: [
    {
      name: "Paquetes para Asar",
      slug: "paquetes-para-asar",
      imageURL: "/uploads/images/Carniceria/CarneRes/Cowboy.png", // 🟢 Modificado
      order: 1,
    },
    {
      name: "Paquetes para Discada",
      slug: "paquetes-para-discada",
      imageURL: "/uploads/images/Paquetes/paquete-discada.png", // 🟢 Modificado
      order: 2,
    },
  ],
  CARNITAS: [
    {
      name: "Carnitas Tradicionales",
      slug: "carnitas-tradicionales",
      imageURL: "/uploads/images/Carniceria/CarneCerdo/cerdo-costilla.png", // 🟢 Modificado
      order: 1,
    },
    {
      name: "Chicharrones",
      slug: "chicharrones",
      imageURL: "/uploads/images/Carnitas/chicharron.png", // 🟢 Modificado
      order: 2,
    },
  ],
  CONGELADO: [
    {
      name: "Hamburguesas",
      slug: "hamburguesas",
      imageURL: "/uploads/images/Congelado/Carne-para-hamburguesa-Burgy.jpg", // 🟢 Modificado
      order: 1,
    },
    {
      name: "Nuggets",
      slug: "nuggets",
      imageURL: "/uploads/images/Congelado/nuggets.png", // 🟢 Modificado
      order: 2,
    },
  ],
};

const products = [
  // ----------------------------------------------------------------------
  // CATEGORÍA: CARNE DE RES (slug: "carne-de-res")
  // ----------------------------------------------------------------------
  {
    name: "Bistec de Res Selecto",
    slug: "bistec-de-res-selecto",
    description:
      "Corte delgado y magro, ideal para asar o freír. Frescura garantizada. El corte de Res más popular.",
    imageURL: "/uploads/images/Carniceria/CarneRes/bisteck0.png",
    categorySlug: "carne-de-res",
    price: 195.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Carne Molida Premium 80/20",
    slug: "carne-molida-premium",
    description:
      "Carne fresca y molida con la mezcla ideal de grasa para hamburguesas jugosas y albóndigas.",
    imageURL: "/uploads/images/Carniceria/CarneRes/molida-especial.png",
    categorySlug: "carne-de-res",
    price: 150.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Diezmillo para Guisar",
    slug: "diezmillo-para-guisar",
    description:
      "Corte de res económico y sabroso, ideal para guisos lentos, caldos o estofados.",
    imageURL: "/uploads/images/Carniceria/CarneRes/diezmillo-marinado.png",
    categorySlug: "carne-de-res",
    price: 120.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Milanesa de Res",
    slug: "milanesa-de-res",
    description:
      "Corte de res económico y sabroso, ideal para guisos lentos, caldos o empanizar.",
    imageURL: "/uploads/images/Carniceria/CarneRes/milanesa-res.png",
    categorySlug: "carne-de-res",
    price: 85.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: CARNE DE PUERCO (slug: "carne-de-puerco")
  // ----------------------------------------------------------------------
  {
    name: "Chuleta de Puerco Ahumada",
    slug: "chuleta-puerco-ahumada",
    description:
      "Chuletas gruesas de puerco con un delicioso sabor ahumado. Perfectas para sartén.",
    imageURL: "/uploads/images/Carniceria/CarneCerdo/chuleta-cerdo-ahumada.png",
    categorySlug: "carne-de-puerco",
    price: 110.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Costilla de Cerdo St. Louis",
    slug: "costilla-st-louis",
    description:
      "Rack de costillas cortadas estilo St. Louis, perfectas para la barbacoa.",
    imageURL: "/uploads/images/Carniceria/CarneCerdo/cerdo-costilla.png",
    categorySlug: "carne-de-puerco",
    price: 290.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Espaldilla de Puerco",
    slug: "espaldilla-puerco",
    description:
      "Corte magro de cerdo ideal para preparar chicharrón prensado o carne deshebrada.",
    imageURL: "/uploads/images/Carniceria/CarneCerdo/espaldilla-cerdo.png",
    categorySlug: "carne-de-puerco",
    price: 95.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Molida de Cerdo",
    slug: "molida-de-cerdo",
    description:
      "Lomo de cerdo fresco, sin hueso. Ideal para asar al horno o rellenar.",
    imageURL: "/uploads/images/Carniceria/CarneCerdo/molida-cerdo.png",
    categorySlug: "carne-de-puerco",
    price: 140.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: POLLO (slug: "pollo")
  // ----------------------------------------------------------------------
  {
    name: "Pechuga de Pollo Sin Hueso",
    slug: "pechuga-pollo-sin-hueso",
    description:
      "Pechugas de pollo frescas, sin hueso ni piel, listas para filetear.",
    imageURL: "/uploads/images/Carniceria/Pollo/pollo-pechuga.png",
    categorySlug: "pollo",
    price: 98.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Muslo y Pierna (Con Hueso)",
    slug: "muslo-y-pierna-hueso",
    description:
      "Paquete mixto de muslo y pierna, jugosos, ideales para caldos.",
    imageURL: "/uploads/images/Carniceria/Pollo/pollo-pierna-muslo.png",
    categorySlug: "pollo",
    price: 70.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Alas de Pollo Enteras",
    slug: "alas-de-pollo-enteras",
    description: "Alas frescas, perfectas para marinadas caseras o freír.",
    imageURL: "/uploads/images/Carniceria/Pollo/pollo-alitas.png",
    categorySlug: "pollo",
    price: 80.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Milanesa de Pollo",
    slug: "milanesa-pollo",
    description:
      "Filetes delgados de pechuga listos para empanizar. Fáciles y rápidos.",
    imageURL: "/uploads/images/Carniceria/Pollo/milanesa-pollo.png",
    categorySlug: "pollo",
    price: 75.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: PROCESADO (slug: "procesado")
  // ----------------------------------------------------------------------
  {
    name: "Jamón de Pavo y Cerdo",
    slug: "jamon-pavo-cerdo",
    description:
      "Jamón de calidad, ideal para sándwiches y desayunos. Rebanado fino.",
    imageURL: "/uploads/images/jamon.jpg",
    categorySlug: "procesado",
    price: 55.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Salchicha de Viena",
    slug: "salchicha-viena",
    description:
      "Salchichas ideales para hot dogs y botanas. Empacadas al vacío.",
    imageURL: "/uploads/images/salchicha.jpg",
    categorySlug: "procesado",
    price: 40.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Tocino Ahumado",
    slug: "tocino-ahumado",
    description:
      "Tiras de tocino crujiente con profundo sabor ahumado. Ideal para desayunos.",
    imageURL: "/uploads/images/tocino.jpg",
    categorySlug: "procesado",
    price: 65.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Chorizo de Cerdo",
    slug: "chorizo-de-cerdo",
    description:
      "Chorizo tradicional de cerdo con especias, perfecto para huevos o asados.",
    imageURL: "/uploads/images/chorizo.jpg",
    categorySlug: "procesado",
    price: 45.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: CORTES PARA ASAR (slug: "cortes-para-asar")
  // ----------------------------------------------------------------------
  {
    name: "Arrachera Marinada",
    slug: "arrachera-marinada",
    description:
      "Corte premium de falda de res marinado. Jugoso y con sabor intenso. Lista para la parrilla.",
    imageURL: "/uploads/images/arrachera-asar.jpg",
    categorySlug: "cortes-para-asar",
    price: 350.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Aguja Norteña",
    slug: "aguja-nortena",
    description:
      "Corte con buen marmoleo y sabor, perfecto para tacos y reuniones. Precio accesible.",
    imageURL: "/uploads/images/aguja-nortena.jpg",
    categorySlug: "cortes-para-asar",
    price: 165.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Sirloin de Res",
    slug: "sirloin-de-res",
    description:
      "Corte magro y con gran sabor, ideal para la parrilla sin ser demasiado graso.",
    imageURL: "/uploads/images/sirloin-asar.jpg",
    categorySlug: "cortes-para-asar",
    price: 150.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Costilla Cargada de Res",
    slug: "costilla-cargada-res",
    description:
      "Tiras de costilla con carne adherida. Mucho sabor para cocción lenta en el asador.",
    imageURL: "/uploads/images/costilla-cargada.jpg",
    categorySlug: "cortes-para-asar",
    price: 210.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: CORTES PREMIUM (slug: "cortes-premium")
  // ----------------------------------------------------------------------
  {
    name: "Rib Eye Prime",
    slug: "rib-eye-prime",
    description:
      "El rey de los cortes. Alto marmoleo y textura mantequillosa. 1 pulgada de grosor.",
    imageURL: "/uploads/images/rib-eye.jpg",
    categorySlug: "cortes-premium",
    price: 420.0,
    stock: 50,
    unitType: "Pieza", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "New York Strip",
    slug: "new-york-strip",
    description:
      "Corte con una banda de grasa lateral que da un gran sabor. Ideal para amantes del sabor intenso.",
    imageURL: "/uploads/images/new-york.jpg",
    categorySlug: "cortes-premium",
    price: 380.0,
    stock: 50,
    unitType: "Pieza", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Filete Mignon",
    slug: "filete-mignon-premium",
    description:
      "El corte más tierno. Magro y delicado, perfecto para ocasiones especiales.",
    imageURL: "/uploads/images/filete-mignon-prem.jpg",
    categorySlug: "cortes-premium",
    price: 550.0,
    stock: 50,
    unitType: "Pieza", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Tomahawk de Res",
    slug: "tomahawk-de-res",
    description:
      "Imponente corte Rib Eye con hueso de costilla largo. El centro de la mesa.",
    imageURL: "/uploads/images/tomahawk.jpg",
    categorySlug: "cortes-premium",
    price: 950.0,
    stock: 50,
    unitType: "Pieza", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: PAQUETES PARA ASAR (slug: "paquetes-para-asar")
  // ----------------------------------------------------------------------
  {
    name: "Paquete Familiar BBQ",
    slug: "paquete-familiar-bbq",
    description:
      "Incluye Arrachera, Aguja Norteña, Chorizo y Salsas. Perfecto para 6-8 personas.",
    imageURL: "/uploads/images/paq-familiar.jpg",
    categorySlug: "paquetes-para-asar",
    price: 799.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Fiesta Grande",
    slug: "paquete-fiesta-grande",
    description:
      "Rib Eye, New York y Tiras de Costilla. Calidad premium para tu fiesta.",
    imageURL: "/uploads/images/paq-fiesta.jpg",
    categorySlug: "paquetes-para-asar",
    price: 1250.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Tacos de Asada",
    slug: "paquete-tacos-asada",
    description:
      "Bistec para asar, Molida, Tortillas y Limones. Todo para unos tacos rápidos.",
    imageURL: "/uploads/images/paq-tacos.jpg",
    categorySlug: "paquetes-para-asar",
    price: 450.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Básico Parrillero",
    slug: "paquete-basico-parrillero",
    description:
      "Chorizo, Longaniza y Aguja Norteña. Lo esencial para empezar el asado.",
    imageURL: "/uploads/images/paq-basico.jpg",
    categorySlug: "paquetes-para-asar",
    price: 599.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: PAQUETES PARA DISCADA (slug: "paquetes-para-discada")
  // ----------------------------------------------------------------------
  {
    name: "Paquete Discada Res/Puerco",
    slug: "paquete-discada-res-puerco",
    description:
      "Paquete para 6 personas. Carne de res, carne de puerco, tocino y chorizo listos para tu disco.",
    imageURL: "/uploads/images/discada-res-puerco.jpg",
    categorySlug: "paquetes-para-discada",
    price: 650.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Discada Pollo/Puerco",
    slug: "paquete-discada-pollo-puerco",
    description:
      "Paquete para 10 personas. Carne de pollo, puerco, salchicha y tocino. Una mezcla diferente y ligera.",
    imageURL: "/uploads/images/discada-pollo-puerco.jpg",
    categorySlug: "paquetes-para-discada",
    price: 590.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Surtido Premium Discada",
    slug: "paquete-surtido-discada",
    description:
      "Paquete para 15 personas. Incluye Arrachera, Bistec, Lomo de Cerdo y Chuleta. Para una discada de lujo.",
    imageURL: "/uploads/images/discada-premium.jpg",
    categorySlug: "paquetes-para-discada",
    price: 890.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Adobo para Discada",
    slug: "adobo-para-discada",
    description:
      "Adobo especial de la casa, listo para marinar tu carne antes de la discada.",
    imageURL: "/uploads/images/adobo-discada.jpg",
    categorySlug: "paquetes-para-discada",
    price: 75.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: CARNITAS TRADICIONALES (slug: "carnitas-tradicionales")
  // ----------------------------------------------------------------------
  {
    name: "Carnitas Surtidas (Maciza, Cuerito, Costilla)",
    slug: "carnitas-surtidas",
    description:
      "Mezcla tradicional de carnitas. Tiernas y doradas. Listas para servir.",
    imageURL: "/uploads/images/carnitas-surtidas.jpg",
    categorySlug: "carnitas-tradicionales",
    price: 190.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Maciza de Puerco (Pura Carne)",
    slug: "maciza-de-puerco",
    description:
      "Solo carne magra de puerco, suave y jugosa. Ideal para quienes prefieren sin grasa.",
    imageURL: "/uploads/images/maciza.jpg",
    categorySlug: "carnitas-tradicionales",
    price: 210.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Cueritos Encurtidos",
    slug: "cueritos-encurtidos",
    description:
      "Cueritos de cerdo en vinagre, perfectos para tostadas y botanas.",
    imageURL: "/uploads/images/cueritos-encurtidos.jpg",
    categorySlug: "carnitas-tradicionales",
    price: 80.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Buche de Cerdo",
    slug: "buche-de-cerdo",
    description:
      "Buche suave de cerdo, cocido y listo para añadir a tus tacos de carnitas.",
    imageURL: "/uploads/images/buche-cerdo.jpg",
    categorySlug: "carnitas-tradicionales",
    price: 95.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: CHICHARRONES (slug: "chicharrones")
  // ----------------------------------------------------------------------
  {
    name: "Chicharrón Prensado",
    slug: "chicharron-prensado",
    description:
      "Chicharrón suave y prensado, ideal para preparar guisos, gorditas y quesadillas.",
    imageURL: "/uploads/images/chicharron-prensado.jpg",
    categorySlug: "chicharrones",
    price: 160.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Chicharrón de Cachete",
    slug: "chicharron-cachete",
    description:
      "Chicharrón crujiente de cachete de puerco. El más sabroso para un snack.",
    imageURL: "/uploads/images/chicharron-cachete.jpg",
    categorySlug: "chicharrones",
    price: 70.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Chicharrón de Pancita",
    slug: "chicharron-pancita",
    description:
      "Pedazos de pancita de cerdo frita, perfecta para botanear con limón y salsa.",
    imageURL: "/uploads/images/chicharron-pancita.jpg",
    categorySlug: "chicharrones",
    price: 230.0,
    stock: 50,
    unitType: "Kg", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Salsa Casera para Chicharrón",
    slug: "salsa-chicharron",
    description:
      "Salsa roja casera especial para bañar o mojar tu chicharrón. Picosita.",
    imageURL: "/uploads/images/salsa-chicharron.jpg",
    categorySlug: "chicharrones",
    price: 50.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: HAMBURGUESAS (slug: "hamburguesas")
  // ----------------------------------------------------------------------
  {
    name: "Carne para Hamburguesa de Res",
    slug: "carne-hamburguesa-res",
    description:
      "Medallones de carne de res premium, 1/4 de libra. Listos para la parrilla.",
    imageURL: "/uploads/images/carne-hamb-res.jpg",
    categorySlug: "hamburguesas",
    price: 180.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Carne para Hamburguesa de Pollo",
    slug: "carne-hamburguesa-pollo",
    description: "Medallones de pechuga de pollo molida. Opción más ligera.",
    imageURL: "/uploads/images/carne-hamb-pollo.jpg",
    categorySlug: "hamburguesas",
    price: 150.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Paquete Mini Burgers (Congelado)",
    slug: "mini-burgers-congelado",
    description:
      "Medallones pequeños, perfectos para niños o botanas. Congelados individualmente.",
    imageURL: "/uploads/images/mini-burgers.jpg",
    categorySlug: "hamburguesas",
    price: 250.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Pan para Hamburguesa Artesanal",
    slug: "pan-hamburguesa-artesanal",
    description:
      "Pan suave tipo brioche, ideal para elevar tu hamburguesa casera.",
    imageURL: "/uploads/images/pan-hamb.jpg",
    categorySlug: "hamburguesas",
    price: 45.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },

  // ----------------------------------------------------------------------
  // CATEGORÍA: NUGGETS (slug: "nuggets")
  // ----------------------------------------------------------------------
  {
    name: "Nuggets de Pollo Clásicos",
    slug: "nuggets-pollo-clasicos",
    description:
      "Nuggets de pollo empanizados, perfectos para freír o air fryer. Sabor familiar.",
    imageURL: "/uploads/images/nuggets-clasicos.jpg",
    categorySlug: "nuggets",
    price: 180.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Tiras de Pollo Empanizadas",
    slug: "tiras-pollo-empanizadas",
    description:
      "Tiras de pechuga de pollo, crujientes y ya sazonadas. Ideales para ensaladas o sandwiches.",
    imageURL: "/uploads/images/tiras-pollo.jpg",
    categorySlug: "nuggets",
    price: 120.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Bites de Pescado (Congelado)",
    slug: "bites-pescado-congelado",
    description:
      "Pequeños trozos de pescado blanco empanizado. Una alternativa a la carne.",
    imageURL: "/uploads/images/bites-pescado.jpg",
    categorySlug: "nuggets",
    price: 140.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
  {
    name: "Dip de Miel Mostaza (Congelado)",
    slug: "dip-miel-mostaza",
    description:
      "Salsa clásica de miel mostaza para acompañar tus nuggets y tiras de pollo.",
    imageURL: "/uploads/images/dip-miel-mostaza.jpg",
    categorySlug: "nuggets",
    price: 45.0,
    stock: 50,
    unitType: "Paquete", // 🟢 ACTUALIZADO
    isAvailable: true,
  },
];

/**
 * Helper para marcar productos/variaciones como 'isIntegerUnit' y normalizar la etiqueta de unidad.
 */
function applyIntegerFlags(productsArray, options = {}) {
  productsArray.forEach((prod) => {
    if (Array.isArray(prod.variations)) {
      prod.variations.forEach((vari) => {
        if (vari.unitName && !vari.unitLabel) {
          vari.unitLabel = vari.unitName;
        }
        if (typeof vari.isIntegerUnit === "undefined") {
          vari.isIntegerUnit = false;
        }
      });
    }
  });
}

applyIntegerFlags(products);

async function seedDB() {
  if (!process.env.MONGO_URI) {
    console.error(
      "❌ MONGO_URI no está definida. ¡Asegúrate de configurar backend/.env!"
    );
    process.exit(1);
  }

  try {
    // 1. Limpiar datos anteriores
    await Product.deleteMany();
    await Category.deleteMany();
    await User.deleteMany(); // <--- Mantén esta línea para limpiar usuarios
    console.log(
      "🗑️ Colecciones limpiadas (Users, Categories y Products).".red.bold
    );

    // 2. Insertar usuarios UNO POR UNO para activar el middleware 'pre("save")'
    console.log("👥 Iniciando importación de usuarios...");
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        // Asegúrate de que los usuarios se crean con el modelo 'User'
        // y que la contraseña se hashea antes de guardarse.
        const newUser = new User(user); // Crea una nueva instancia del modelo
        await newUser.save(); // Guarda la instancia, activando el middleware pre('save')
        return newUser;
      })
    );

    // 3. Construir array plano de categorías a insertar
    const categoriesToInsert = [];
    for (const principalName in categories) {
      if (categories.hasOwnProperty(principalName)) {
        const principalSlug = principalName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-*|-*$/g, "");

        categoriesToInsert.push({
          name: principalName,
          slug: principalSlug,
          categoryPrincipal: principalSlug,
          parentSlug: null,
          order: 99,
        });

        categories[principalName].forEach((subCat) => {
          categoriesToInsert.push({
            name: subCat.name,
            slug: subCat.slug,
            imageURL: subCat.iconURL || subCat.imageURL || subCat.image || null,
            order: subCat.order || 0,
            parentSlug: principalSlug,
            categoryPrincipal: principalSlug,
          });
        });
      }
    }

    // Insertar categorías y productos (sigue usando insertMany para ellos)
    await Category.insertMany(categoriesToInsert);
    console.log("📂 Categorías importadas!".green.bold);

    await Product.insertMany(products);
    console.log("🥩 Productos importados!".green.bold);

    console.log("✨ Datos de prueba importados con éxito.".green.bold);
  } catch (error) {
    console.error(
      `❌ Error en la inserción de datos: ${error.message}`.red.bold
    );
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log("🔌 Conexión a MongoDB cerrada.");
    }
  }
}

seedDB();

export default categories;
