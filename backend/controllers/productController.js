import Product from "../models/ProductModel.js";
import Category from "../models/categoryModel.js"; 

// --- Controladores para Obtener Productos (Tus funciones GET existentes, ligeramente ajustadas) ---

// @desc    Obtener todos los productos (con paginación, filtros y búsqueda)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category: categorySlugQuery, q, limit } = req.query; // Renombrado para evitar conflicto

  try {
    let query = {};

    if (categorySlugQuery) {
      // Usamos el parámetro de query para filtrar por categorySlug
      query.categorySlug = categorySlugQuery;
    }
    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    let mongooseQuery = Product.find(query);
    if (limit) {
      const numLimit = parseInt(limit, 10);
      if (!isNaN(numLimit) && numLimit > 0) {
        mongooseQuery = mongooseQuery.limit(numLimit);
      }
    }

    const products = await mongooseQuery;
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res
      .status(500)
      .json({ message: "Error interno del servidor.", error: error.message });
  }
};

// @desc    Obtiene un producto por su slug (ej. /api/products/bistec-de-res-selecto)
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener producto", error: error.message });
  }
};

// @desc    Obtiene productos por una categoría (slug)
// @route   GET /api/products/category/:categorySlug
// @access  Public
const getProductsByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params; // Usamos categorySlug del parámetro de la URL

    const products = await Product.find({
      categorySlug: { $regex: new RegExp(categorySlug, "i") }, // Filtramos por categorySlug
    });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos para esta categoría." });
    }

    res.json(products);
  } catch (error) {
    console.error(`Error al obtener productos por categoría: ${error.message}`);
    res.status(500).json({
      message: "Error interno del servidor al filtrar productos.",
      error: error.message,
    });
  }
};

// @desc    Busca productos por nombre o descripción
// @route   GET /api/products/search?q=query
// @access  Public
const searchProducts = async (req, res) => {
  try {
    const keyword = req.query.q
      ? {
          $or: [
            { name: { $regex: req.query.q, $options: "i" } },
            { description: { $regex: req.query.q, $options: "i" } },
          ],
        }
      : {};

    const products = await Product.find({ ...keyword });
    res.json(products);
  } catch (error) {
    console.error(`Error en la búsqueda de productos: ${error.message}`);
    res.status(500).json({
      message: "Error interno del servidor durante la búsqueda.",
      error: error.message,
    });
  }
};

// --- Controladores para el CRUD (Agregar, Actualizar, Eliminar) ---

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Private/Admin/Editor
const createProduct = async (req, res) => {
  const {
    name,
    slug,
    price,
    stock,
    description,
    imageURL,
    categorySlug,
    variations,
    isAvailable,
  } = req.body;

  try {
    // Validar que el categorySlug exista en la colección de categorías
    const categoryExists = await Category.findOne({ slug: categorySlug });
    if (!categoryExists) {
      res.status(400);
      throw new Error(
        'El "categorySlug" especificado no corresponde a una categoría existente.'
      );
    }

    const product = new Product({
      name: name,
      slug: slug,
      description: description,
      imageURL: imageURL,
      categorySlug: categorySlug,
      variations: variations,
      isAvailable: isAvailable ?? true,
      // Nota: Tu ProductModel no tiene un campo 'user' para el creador. Si lo necesitas,
      // añádelo a ProductModel y descomenta la línea 'user: req.user._id,'
      // user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Error interno del servidor al crear producto.",
    });
  }
};

// @desc    Actualizar un producto existente
// @route   PUT /api/products/:slug
// @access  Private/Admin/Editor
const updateProduct = async (req, res) => {
  const {
    name,
    price,
    stock,
    description,
    imageURL,
    categorySlug,
    variations,
    isAvailable,
  } = req.body;

  try {
    // Buscamos el producto por el slug en los parámetros de la URL
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      // Validar que el nuevo categorySlug exista si se intenta actualizar y es diferente
      if (categorySlug && product.categorySlug !== categorySlug) {
        const categoryExists = await Category.findOne({ slug: categorySlug });
        if (!categoryExists) {
          res.status(400);
          throw new Error(
            'El nuevo "categorySlug" especificado no corresponde a una categoría existente.'
          );
        }
      }

      product.name = name ?? product.name;
      // El slug del producto no se actualiza directamente desde el body porque lo usamos para buscarlo.
      // Si el slug necesita ser actualizable, la ruta PUT debería ser por _id o manejar el cambio de slug explícitamente.
      product.price = price ?? product.price;
      product.stock = stock ?? product.stock;
      product.description = description ?? product.description;
      product.imageURL = imageURL ?? product.imageURL;
      product.categorySlug = categorySlug ?? product.categorySlug;
      product.variations = variations ?? product.variations;
      product.isAvailable = isAvailable ?? product.isAvailable;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(error.statusCode || 500).json({
      message:
        error.message || "Error interno del servidor al actualizar producto.",
    });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:slug
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }); // Buscamos por slug

    if (product) {
      await product.deleteOne(); // Mongoose v6+
      res.json({ message: "Producto eliminado con éxito." });
    } else {
      res.status(404);
      throw new Error("Producto no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(error.statusCode || 500).json({
      message:
        error.message || "Error interno del servidor al eliminar producto.",
    });
  }
};

export {
  getProducts,
  getProductBySlug,
  getProductsByCategory,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
