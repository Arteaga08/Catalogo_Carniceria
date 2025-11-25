import mongoose from 'mongoose';

const categorySchema = mongoose.Schema(
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
        categoryPrincipal: {
            type: String,
            required: true,
        },
        // soportar campos de imagen con nombres claros
        iconURL: {
            type: String,
            required: false,
            default: "/images/default_category.png",
        },
        imageURL: {
            type: String,
            required: false,
            default: null,
        },
        order: {
            type: Number,
            default: 99,
        },
    },
    {
        timestamps: true,
    }
);

const Category = mongoose.model('Category', categorySchema);

export default Category;