import Category from '../models/categoryModel.js'; 

const getCategories = async (req, res) => {
    try {
        // Obtiene las 12 categorías
        const categories = await Category.find({}).sort({ categoryPrincipal: 1, order: 1 });

        // Agrupa por el nombre de la pestaña principal (CARNICERÍA, PAQUETES, etc.)
        const groupedCategories = categories.reduce((acc, category) => {
            const principal = category.categoryPrincipal;
            if (!acc[principal]) {
                acc[principal] = [];
            }
            acc[principal].push(category);
            return acc;
        }, {});

        res.json(groupedCategories);
    } catch (error) {
        // En caso de error de BD
        res.status(500).json({ message: 'Error fetching categories', error: error.message });
    }
};

export { getCategories };