import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/categoryModel.js";
import Product from "./models/ProductModel.js";

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
      iconURL: "/images/Carniceria/CarneRes/New-york.png",
      order: 1,
    },
    {
      name: "Carne de Puerco",
      slug: "carne-de-puerco",
      iconURL: "/images/Carniceria/CarneCerdo/chuleta-cerdo-ahumada.png",
      order: 2,
    },
    {
      name: "Pollo",
      slug: "pollo",
      iconURL: "/images/Carniceria/Pollo/pollo-pechuga.png",
      order: 3,
    },
    {
      name: "Procesado",
      slug: "procesado",
      iconURL: "/images/Congelado/Carne-para-hamburguesa-Burgy.jpg",
      order: 4,
    },
  ],
  "CORTES PARRILLEROS": [
    {
      name: "Cortes para Asar",
      slug: "cortes-para-asar",
      iconURL: "/images/Carniceria/CarneRes/Tomahawk.png",
      order: 1,
    },
    {
      name: "Cortes Premium",
      slug: "cortes-premium",
      iconURL: "/images/Parrilleros/cortes-premium.png",
      order: 2,
    },
  ],
  PAQUETES: [
    {
      name: "Paquetes para Asar",
      slug: "paquetes-para-asar",
      iconURL: "/images/Carniceria/CarneRes/Cowboy.png",
      order: 1,
    },
    {
      name: "Paquetes para Discada",
      slug: "paquetes-para-discada",
      iconURL: "/images/Paquetes/paquete-discada.png",
      order: 2,
    },
  ],
  CARNITAS: [
    {
      name: "Carnitas Tradicionales",
      slug: "carnitas-tradicionales",
      iconURL: "/images/Carniceria/CarneCerdo/cerdo-costilla.png",
      order: 1,
    },
    {
      name: "Chicharrones",
      slug: "chicharrones",
      iconURL: "/images/Carnitas/chicharron.png",
      order: 2,
    },
  ],
  CONGELADO: [
    {
      name: "Hamburguesas",
      slug: "hamburguesas",
      iconURL: "/images/Congelado/Carne-para-hamburguesa-Burgy.jpg",
      order: 1,
    },
    {
      name: "Nuggets",
      slug: "nuggets",
      iconURL: "/images/Congelado/nuggets.png",
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
    imageURL: "/images/Carniceria/CarneRes/bisteck0.png",
    categorySlug: "carne-de-res",
    variations: [
      {
        unitName: "Kg",
        price: 195.0,
        isIntegerUnit: false, // Peso = Decimales
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
      {
        unitName: "Medio Kilo (500g)",
        price: 97.5,
        isIntegerUnit: true, // Venta por paquete fijo de 500g = Entero
        unitReference: "KG",
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Carne Molida Premium 80/20",
    slug: "carne-molida-premium",
    description:
      "Carne fresca y molida con la mezcla ideal de grasa para hamburguesas jugosas y albóndigas.",
    imageURL: "/images/Carniceria/CarneRes/molida-especial.png",
    categorySlug: "carne-de-res",
    variations: [
      {
        unitName: "KG",
        price: 150.0,
        isIntegerUnit: false, // Peso
        unitReference: "Kg",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Diezmillo para Guisar",
    slug: "diezmillo-para-guisar",
    description:
      "Corte de res económico y sabroso, ideal para guisos lentos, caldos o estofados.",
    imageURL: "/images/Carniceria/CarneRes/diezmillo-marinado.png",
    categorySlug: "carne-de-res",
    variations: [
      {
        unitName: "KG",
        price: 120.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Milanesa de Res",
    slug: "milanesa-de-res",
    description:
      "Corte de res económico y sabroso, ideal para guisos lentos, caldos o empanizar.",
    imageURL: "/images/Carniceria/CarneRes/milanesa-res.png",
    categorySlug: "carne-de-res",
    variations: [
      {
        unitName: "KG",
        price: 85.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
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
    imageURL: "/images/Carniceria/CarneCerdo/chuleta-cerdo-ahumada.png",
    categorySlug: "carne-de-puerco",
    variations: [
      {
        unitName: "KG",
        price: 110.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Costilla de Cerdo St. Louis",
    slug: "costilla-st-louis",
    description:
      "Rack de costillas cortadas estilo St. Louis, perfectas para la barbacoa.",
    imageURL: "/images/Carniceria/CarneCerdo/cerdo-costilla.png",
    categorySlug: "carne-de-puerco",
    variations: [
      {
        unitName: "KG",
        price: 290.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Espaldilla de Puerco",
    slug: "espaldilla-puerco",
    description:
      "Corte magro de cerdo ideal para preparar chicharrón prensado o carne deshebrada.",
    imageURL: "/images/Carniceria/CarneCerdo/espaldilla-cerdo.png",
    categorySlug: "carne-de-puerco",
    variations: [
      {
        unitName: "KG",
        price: 95.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Molida de Cerdo",
    slug: "molida-de-cerdo",
    description:
      "Lomo de cerdo fresco, sin hueso. Ideal para asar al horno o rellenar.",
    imageURL: "/images/Carniceria/CarneCerdo/molida-cerdo.png",
    categorySlug: "carne-de-puerco",
    variations: [
      {
        unitName: "KG",
        price: 140.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
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
    imageURL: "/images/Carniceria/Pollo/pollo-pechuga.png",
    categorySlug: "pollo",
    variations: [
      {
        unitName: "KG",
        price: 98.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Muslo y Pierna (Con Hueso)",
    slug: "muslo-y-pierna-hueso",
    description:
      "Paquete mixto de muslo y pierna, jugosos, ideales para caldos.",
    imageURL: "/images/Carniceria/Pollo/pollo-pierna-muslo.png",
    categorySlug: "pollo",
    variations: [
      {
        unitName: "KG",
        price: 70.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Alas de Pollo Enteras",
    slug: "alas-de-pollo-enteras",
    description: "Alas frescas, perfectas para marinadas caseras o freír.",
    imageURL: "/images/Carniceria/Pollo/pollo-alitas.png",
    categorySlug: "pollo",
    variations: [
      {
        unitName: "KG",
        price: 80.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Milanesa de Pollo",
    slug: "milanesa-pollo",
    description:
      "Filetes delgados de pechuga listos para empanizar. Fáciles y rápidos.",
    imageURL: "/images/Carniceria/Pollo/milanesa-pollo.png",
    categorySlug: "pollo",
    variations: [
      {
        unitName: "KG",
        price: 75.0,
        isIntegerUnit: false, // Peso
        unitReference: "KG",
        approxWeightGrams: 500,
      },
    ],
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
    imageURL: "/images/jamon.jpg",
    categorySlug: "procesado",
    variations: [
      {
        unitName: "Paquete (250g)",
        price: 55.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 250,
      },
      {
        unitName: "Kilo (1000g)",
        price: 180.0,
        unitReference: "KG",
        isIntegerUnit: false, // Kilo suelto = Decimales
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Salchicha de Viena",
    slug: "salchicha-viena",
    description:
      "Salchichas ideales para hot dogs y botanas. Empacadas al vacío.",
    imageURL: "/images/salchicha.jpg",
    categorySlug: "procesado",
    variations: [
      {
        unitName: "Paquete (500g)",
        price: 40.0,
        isIntegerUnit: true, // Paquete
        unitReference: "PAQ",
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Tocino Ahumado",
    slug: "tocino-ahumado",
    description:
      "Tiras de tocino crujiente con profundo sabor ahumado. Ideal para desayunos.",
    imageURL: "/images/tocino.jpg",
    categorySlug: "procesado",
    // isIntegerUnit eliminado de la raíz
    variations: [
      {
        unitName: "Paquete (200g)",
        price: 65.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 200,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Chorizo de Cerdo",
    slug: "chorizo-de-cerdo",
    description:
      "Chorizo tradicional de cerdo con especias, perfecto para huevos o asados.",
    imageURL: "/images/chorizo.jpg",
    categorySlug: "procesado",
    variations: [
      {
        unitName: "Paquete (250g)",
        price: 45.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 250,
      },
    ],
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
    imageURL: "/images/arrachera-asar.jpg",
    categorySlug: "cortes-para-asar",
    variations: [
      {
        unitName: "Paquete de 1.5 KG",
        price: 350.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Es un paquete cerrado
        approxWeightGrams: 1500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Aguja Norteña",
    slug: "aguja-nortena",
    description:
      "Corte con buen marmoleo y sabor, perfecto para tacos y reuniones. Precio accesible.",
    imageURL: "/images/aguja-nortena.jpg",
    categorySlug: "cortes-para-asar",
    variations: [
      {
        unitName: "KG",
        price: 165.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Sirloin de Res",
    slug: "sirloin-de-res",
    description:
      "Corte magro y con gran sabor, ideal para la parrilla sin ser demasiado graso.",
    imageURL: "/images/sirloin-asar.jpg",
    categorySlug: "cortes-para-asar",
    variations: [
      {
        unitName: "Pieza (aprox. 300g)",
        price: 150.0,
        unitReference: "PZA",
        isIntegerUnit: true, // Pieza = Entero
        approxWeightGrams: 300,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Costilla Cargada de Res",
    slug: "costilla-cargada-res",
    description:
      "Tiras de costilla con carne adherida. Mucho sabor para cocción lenta en el asador.",
    imageURL: "/images/costilla-cargada.jpg",
    categorySlug: "cortes-para-asar",
    variations: [
      {
        unitName: "KG",
        price: 210.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
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
    imageURL: "/images/rib-eye.jpg",
    categorySlug: "cortes-premium",
    variations: [
      {
        unitName: "Pieza (aprox. 400g)",
        price: 420.0,
        unitReference: "PZA",
        isIntegerUnit: true, // Pieza
        approxWeightGrams: 400,
      },
    ],
    isAvailable: true,
  },
  {
    name: "New York Strip",
    slug: "new-york-strip",
    description:
      "Corte con una banda de grasa lateral que da un gran sabor. Ideal para amantes del sabor intenso.",
    imageURL: "/images/new-york.jpg",
    categorySlug: "cortes-premium",
    variations: [
      {
        unitName: "Pieza (aprox. 350g)",
        price: 380.0,
        unitReference: "PZA",
        isIntegerUnit: true, // Pieza
        approxWeightGrams: 350,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Filete Mignon",
    slug: "filete-mignon-premium",
    description:
      "El corte más tierno. Magro y delicado, perfecto para ocasiones especiales.",
    imageURL: "/images/filete-mignon-prem.jpg",
    categorySlug: "cortes-premium",
    variations: [
      {
        unitName: "Pieza (aprox. 350g)",
        price: 550.0,
        unitReference: "PZA",
        isIntegerUnit: true, // Pieza
        approxWeightGrams: 300,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Tomahawk de Res",
    slug: "tomahawk-de-res",
    description:
      "Imponente corte Rib Eye con hueso de costilla largo. El centro de la mesa.",
    imageURL: "/images/tomahawk.jpg",
    categorySlug: "cortes-premium",
    variations: [
      {
        unitName: "Pieza (aprox. 1.2 KG)",
        price: 950.0,
        unitReference: "PZA",
        isIntegerUnit: true, // Pieza
        approxWeightGrams: 1200,
      },
    ],
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
    imageURL: "/images/paq-familiar.jpg",
    categorySlug: "paquetes-para-asar",
    variations: [
      {
        unitName: "Paquete Total",
        price: 799.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 4000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Fiesta Grande",
    slug: "paquete-fiesta-grande",
    description:
      "Rib Eye, New York y Tiras de Costilla. Calidad premium para tu fiesta.",
    imageURL: "/images/paq-fiesta.jpg",
    categorySlug: "paquetes-para-asar",
    variations: [
      {
        unitName: "Paquete Total",
        price: 1250.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 3500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Tacos de Asada",
    slug: "paquete-tacos-asada",
    description:
      "Bistec para asar, Molida, Tortillas y Limones. Todo para unos tacos rápidos.",
    imageURL: "/images/paq-tacos.jpg",
    categorySlug: "paquetes-para-asar",
    variations: [
      {
        unitName: "Paquete Total",
        price: 450.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 2000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Básico Parrillero",
    slug: "paquete-basico-parrillero",
    description:
      "Chorizo, Longaniza y Aguja Norteña. Lo esencial para empezar el asado.",
    imageURL: "/images/paq-basico.jpg",
    categorySlug: "paquetes-para-asar",
    variations: [
      {
        unitName: "Paquete Total",
        price: 599.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 3000,
      },
    ],
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
    imageURL: "/images/discada-res-puerco.jpg",
    categorySlug: "paquetes-para-discada",
    variations: [
      {
        unitName: "Paquete Total",
        price: 650.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 3000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Discada Pollo/Puerco",
    slug: "paquete-discada-pollo-puerco",
    description:
      "Paquete para 10 personas. Carne de pollo, puerco, salchicha y tocino. Una mezcla diferente y ligera.",
    imageURL: "/images/discada-pollo-puerco.jpg",
    categorySlug: "paquetes-para-discada",
    variations: [
      {
        unitName: "Paquete Total",
        price: 590.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 3000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Surtido Premium Discada",
    slug: "paquete-surtido-discada",
    description:
      "Paquete para 15 personas. Incluye Arrachera, Bistec, Lomo de Cerdo y Chuleta. Para una discada de lujo.",
    imageURL: "/images/discada-premium.jpg",
    categorySlug: "paquetes-para-discada",
    variations: [
      {
        unitName: "Paquete Total",
        price: 890.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete completo
        approxWeightGrams: 4000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Adobo para Discada",
    slug: "adobo-para-discada",
    description:
      "Adobo especial de la casa, listo para marinar tu carne antes de la discada.",
    imageURL: "/images/adobo-discada.jpg",
    categorySlug: "paquetes-para-discada",
    variations: [
      {
        unitName: "Botella 500ml",
        price: 75.0,
        unitReference: "BOT",
        isIntegerUnit: true, // Botella (entero)
        approxWeightGrams: 500,
      },
    ],
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
    imageURL: "/images/carnitas-surtidas.jpg",
    categorySlug: "carnitas-tradicionales",
    variations: [
      {
        unitName: "Kilo (1000g)",
        price: 190.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Maciza de Puerco (Pura Carne)",
    slug: "maciza-de-puerco",
    description:
      "Solo carne magra de puerco, suave y jugosa. Ideal para quienes prefieren sin grasa.",
    imageURL: "/images/maciza.jpg",
    categorySlug: "carnitas-tradicionales",
    variations: [
      {
        unitName: "Kilo (1000g)",
        price: 210.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Cueritos Encurtidos",
    slug: "cueritos-encurtidos",
    description:
      "Cueritos de cerdo en vinagre, perfectos para tostadas y botanas.",
    imageURL: "/images/cueritos-encurtidos.jpg",
    categorySlug: "carnitas-tradicionales",
    variations: [
      {
        unitName: "Paquete (500g)",
        price: 80.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Buche de Cerdo",
    slug: "buche-de-cerdo",
    description:
      "Buche suave de cerdo, cocido y listo para añadir a tus tacos de carnitas.",
    imageURL: "/images/buche-cerdo.jpg",
    categorySlug: "carnitas-tradicionales",
    variations: [
      {
        unitName: "Medio Kilo (500g)",
        price: 95.0,
        unitReference: "KG",
        isIntegerUnit: true, // Venta por unidad de 500g fija
        approxWeightGrams: 500,
      },
    ],
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
    imageURL: "/images/chicharron-prensado.jpg",
    categorySlug: "chicharrones",
    variations: [
      {
        unitName: "Kilo (1000g)",
        price: 160.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Chicharrón de Cachete",
    slug: "chicharron-cachete",
    description:
      "Chicharrón crujiente de cachete de puerco. El más sabroso para un snack.",
    imageURL: "/images/chicharron-cachete.jpg",
    categorySlug: "chicharrones",
    variations: [
      {
        unitName: "Paquete (250g)",
        price: 70.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 250,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Chicharrón de Pancita",
    slug: "chicharron-pancita",
    description:
      "Pedazos de pancita de cerdo frita, perfecta para botanear con limón y salsa.",
    imageURL: "/images/chicharron-pancita.jpg",
    categorySlug: "chicharrones",
    variations: [
      {
        unitName: "Kilo (1000g)",
        price: 230.0,
        unitReference: "KG",
        isIntegerUnit: false, // Peso
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Salsa Casera para Chicharrón",
    slug: "salsa-chicharron",
    description:
      "Salsa roja casera especial para bañar o mojar tu chicharrón. Picosita.",
    imageURL: "/images/salsa-chicharron.jpg",
    categorySlug: "chicharrones",
    variations: [
      {
        unitName: "Botella 300ml",
        price: 50.0,
        unitReference: "BOT",
        isIntegerUnit: true, // Botella
        approxWeightGrams: 300,
      },
    ],
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
    imageURL: "/images/carne-hamb-res.jpg",
    categorySlug: "hamburguesas",
    variations: [
      {
        unitName: "Paquete 4 Pzas",
        price: 180.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Carne para Hamburguesa de Pollo",
    slug: "carne-hamburguesa-pollo",
    description: "Medallones de pechuga de pollo molida. Opción más ligera.",
    imageURL: "/images/carne-hamb-pollo.jpg",
    categorySlug: "hamburguesas",
    variations: [
      {
        unitName: "Paquete 4 Pzas",
        price: 150.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Paquete Mini Burgers (Congelado)",
    slug: "mini-burgers-congelado",
    description:
      "Medallones pequeños, perfectos para niños o botanas. Congelados individualmente.",
    imageURL: "/images/mini-burgers.jpg",
    categorySlug: "hamburguesas",
    variations: [
      {
        unitName: "Paquete 12 Pzas",
        price: 250.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 600,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Pan para Hamburguesa Artesanal",
    slug: "pan-hamburguesa-artesanal",
    description:
      "Pan suave tipo brioche, ideal para elevar tu hamburguesa casera.",
    imageURL: "/images/pan-hamb.jpg",
    categorySlug: "hamburguesas",
    variations: [
      {
        unitName: "Paquete 4 Pzas",
        price: 45.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 400,
      },
    ],
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
    imageURL: "/images/nuggets-clasicos.jpg",
    categorySlug: "nuggets",
    variations: [
      {
        unitName: "Bolsa (1 KG)",
        price: 180.0,
        unitReference: "BOL",
        isIntegerUnit: true, // Bolsa cerrada
        approxWeightGrams: 1000,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Tiras de Pollo Empanizadas",
    slug: "tiras-pollo-empanizadas",
    description:
      "Tiras de pechuga de pollo, crujientes y ya sazonadas. Ideales para ensaladas o sandwiches.",
    imageURL: "/images/tiras-pollo.jpg",
    categorySlug: "nuggets",
    variations: [
      {
        unitName: "Paquete (500g)",
        price: 120.0,
        unitReference: "PAQ",
        isIntegerUnit: true, // Paquete
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Bites de Pescado (Congelado)",
    slug: "bites-pescado-congelado",
    description:
      "Pequeños trozos de pescado blanco empanizado. Una alternativa a la carne.",
    imageURL: "/images/bites-pescado.jpg",
    categorySlug: "nuggets",
    variations: [
      {
        unitName: "Bolsa (500g)",
        price: 140.0,
        unitReference: "BOL",
        isIntegerUnit: true, // Bolsa cerrada
        approxWeightGrams: 500,
      },
    ],
    isAvailable: true,
  },
  {
    name: "Dip de Miel Mostaza (Congelado)",
    slug: "dip-miel-mostaza",
    description:
      "Salsa clásica de miel mostaza para acompañar tus nuggets y tiras de pollo.",
    imageURL: "/images/dip-miel-mostaza.jpg",
    categorySlug: "nuggets",
    isIntegerUnit: true,
    variations: [
      {
        unitName: "Bote 300ml",
        price: 45.0,
        unitReference: "BOT",
         // Bote
        approxWeightGrams: 300,
      },
    ],
    isAvailable: true,
  },
];

/**
 * Helper para marcar productos/variaciones como 'isIntegerUnit' y normalizar la etiqueta de unidad.
 */
function applyIntegerFlags(productsArray, options = {}) {
  // Ya no dependemos solo de la detección automática, porque los datos están explícitos.
  // Pero mantenemos la normalización de unitLabel.

  productsArray.forEach((prod) => {
    if (Array.isArray(prod.variations)) {
      prod.variations.forEach((vari) => {
        // 🚨 CORRECCIÓN 2: Normalizar unitName a unitLabel
        if (vari.unitName && !vari.unitLabel) {
          vari.unitLabel = vari.unitName;
        }

        // Si se nos pasó alguno, aplicamos un default seguro (false)
        if (typeof vari.isIntegerUnit === "undefined") {
          vari.isIntegerUnit = false;
        }
      });
    }
  });
}

// Aplicar las flags de normalización
applyIntegerFlags(products);

async function seedDB() {
  if (!MONGODB_URI) {
    console.error(
      "❌ MONGODB_URI no está definida. ¡Asegúrate de configurar backend/.env!"
    );
    return;
  }

  try {
    // 1. Limpiar datos anteriores
    await Category.deleteMany();
    await Product.deleteMany();
    console.log("🗑️ Colecciones limpiadas (Categories y Products).");

    // 2. Construir array plano de categorías a insertar a partir del objeto agrupado
    const categoriesToInsert = [];

    for (const principal in categories) {
      if (categories.hasOwnProperty(principal)) {
        categories[principal].forEach((subCat) => {
          categoriesToInsert.push({
            name: subCat.name,
            slug: subCat.slug,
            // Normalizar el nombre del campo de imagen (iconURL -> imageURL)
            imageURL: subCat.iconURL || subCat.imageURL || subCat.image || null,
            order: subCat.order || 0,
            categoryPrincipal: principal,
          });
        });
      }
    }

    // Insertar categorías y productos (una sola vez cada colección)
    await Category.insertMany(categoriesToInsert);
    await Product.insertMany(products);
    console.log("✨ Datos de prueba importados con éxito.");
  } catch (error) {
    console.error("❌ Error en la inserción de datos:", error.message);
  } finally {
    await mongoose.connection.close();
  }
}

seedDB();

export default categories;
