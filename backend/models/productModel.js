import mongoose from 'mongoose';

const variationSchema = mongoose.Schema({
    unitName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    unitReference: {
        type: String,
        required: true,
    },
    approxWeightGrams: {
        type: Number,
        default: 0,
    },
});

// 2. Definición del Esquema del Producto
const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        imageURL: {
            type: String,
            required: true,
        },
        // Enlaza el producto a su subcategoría por el slug
        categorySlug: {
            type: String,
            required: true,
        },
        variations: [variationSchema], // Usa el sub-esquema aquí
        
        // Campos de control de plantilla
        isAvailable: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Product = mongoose.model('Product', productSchema);

export default Product;