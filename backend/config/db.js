// Archivo: backend/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Conexión usando la URI del archivo .env
        const conn = await mongoose.connect(process.env.MONGO_URI); 
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        // Detiene el proceso con error
        process.exit(1); 
    }
};

export default connectDB;