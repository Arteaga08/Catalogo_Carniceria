import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/CategoryModel.js'; 
import Product from './models/ProductsModel.js';
import connectDB from './config/db.js';

// --- CONFIGURACIÓN Y CONEXIÓN ---
dotenv.config();
const MONGODB_URI = process.env.MONGO_URI;

// Usamos la función de conexión que ya creamos.
connectDB(); 

// --- DATOS DE PRUEBA (DATA) ---
const categories = [
    { name: "Carne de Res", slug: "carne-de-res", categoryPrincipal: "CARNICERÍA", order: 1 },
    { name: "Carne de Puerco", slug: "carne-de-puerco", categoryPrincipal: "CARNICERÍA", order: 2 },
    { name: "Pollo", slug: "pollo", categoryPrincipal: "CARNICERÍA", order: 3 },
    { name: "Procesado", slug: "procesado", categoryPrincipal: "CARNICERÍA", order: 4 },
    { name: "Cortes para Asar", slug: "cortes-para-asar", categoryPrincipal: "CORTES PARRILLEROS", order: 1 },
    { name: "Cortes Premium", slug: "cortes-premium", categoryPrincipal: "CORTES PARRILLEROS", order: 2 },
    { name: "Paquetes para Asar", slug: "paquetes-para-asar", categoryPrincipal: "PAQUETES", order: 1 },
    { name: "Paquetes para Discada", slug: "paquetes-para-discada", categoryPrincipal: "PAQUETES", order: 2 },
    { name: "Carnitas Tradicionales", slug: "carnitas-tradicionales", categoryPrincipal: "CARNITAS", order: 1 },
    { name: "Chicharrones", slug: "chicharrones", categoryPrincipal: "CARNITAS", order: 2 },
    { name: "Hamburguesas", slug: "hamburguesas", categoryPrincipal: "CONGELADO", order: 1 },
    { name: "Nuggets", slug: "nuggets", categoryPrincipal: "CONGELADO", order: 2 },
];

const products = [
    {
        name: "Bistec de Res Selecto",
        slug: "bistec-de-res-selecto",
        description: "Corte delgado y magro, ideal para asar o freír. Frescura garantizada. El corte de Res más popular.",
        imageURL: "/images/bistec-res.jpg",
        categorySlug: "carne-de-res",
        variations: [
            { unitName: "Kilo (1000g)", price: 195.00, unitReference: "KG", approxWeightGrams: 1000 },
            { unitName: "Medio Kilo (500g)", price: 97.50, unitReference: "KG", approxWeightGrams: 500 } // Corregido 'unidadReferencia'
        ],
        isAvailable: true,
    },
    {
        name: "Arrachera Marinada",
        slug: "arrachera-marinada",
        description: "Corte premium marinado listo para la parrilla. Jugoso y con sabor intenso.",
        imageURL: "/images/arrachera.jpg",
        categorySlug: "cortes-para-asar",
        variations: [
            { unitName: "Paquete de 1.5 KG", price: 350.00, unitReference: "PAQ", approxWeightGrams: 1500 },
        ],
        isAvailable: true,
    },
    {
        name: "Molida De Res",
        slug: "molida_de_res",
        description: "Corte premium molida listo para la parrilla. Jugoso y con sabor intenso.",
        imageURL: "/images/molida.jpg",
        categorySlug: "carne-de-res",
        variations: [
            { unitName: "Paquete de 1.5 KG", price: 350.00, unitReference: "PAQ", approxWeightGrams: 1500 },
        ],
        isAvailable: true,
    },
];


async function seedDB() {
  if (!MONGODB_URI) {
    console.error("❌ MONGODB_URI no está definida. ¡Asegúrate de configurar backend/.env!");
    return;
  }

  try {
    // 1. Limpiar datos anteriores
    await Category.deleteMany(); 
    await Product.deleteMany(); 
    console.log("🗑️ Colecciones limpiadas (Categories y Products).");

    // 2. Insertar los nuevos datos
    await Category.insertMany(categories); 
    await Product.insertMany(products); 
    
    console.log("✨ Datos de prueba importados con éxito.");

  } catch (error) {
    console.error("❌ Error en la inserción de datos:", error.message);
  } finally {
    await mongoose.connection.close(); 
  }
}

seedDB();