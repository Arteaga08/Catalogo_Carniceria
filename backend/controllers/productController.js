import Product from "../models/ProductModel.js";
import Category from "../models/categoryModel.js";
import slugify from "slugify";

// --- Controladores para Obtener Productos ---

// @desc    Obtener todos los productos (con paginación, filtros y búsqueda)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const { category: categorySlugQuery, q, limit } = req.query;

  try {
    let query = {};

    // 🟢 Habilitamos el filtro de disponibilidad (puedes comentarlo para depurar si es necesario)
    query.isAvailable = true;

    if (categorySlugQuery) {
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

// @desc    Obtiene un producto por su slug
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
    const { categorySlug } = req.params;

    const products = await Product.find({
      categorySlug: { $regex: new RegExp(categorySlug, "i") },
      isAvailable: true,
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
    price,
    stock,
    description,
    categorySlug,
    unitType,
    isAvailable,
  } = req.body;

  // Si hay archivo, construimos la ruta. Si no, undefined.
  // Nota: Al usar el nuevo middleware con ruta absoluta, req.file.path puede ser muy largo.
  // Es mejor construir la URL pública manualmente basada en el filename.
  let imagePath = undefined;
  if (req.file) {
    imagePath = `/uploads/products/${req.file.filename}`;
  }

  const productSlug = slugify(name, { lower: true, strict: true });

  try {
    const categoryExists = await Category.findOne({ slug: categorySlug });
    if (!categoryExists) {
      res.status(400);
      throw new Error(
        'El "categorySlug" especificado no corresponde a una categoría existente.'
      );
    }

    const productExists = await Product.findOne({ slug: productSlug });
    if (productExists) {
      res.status(400);
      throw new Error(
        "Ya existe un producto con este nombre. Por favor, cambia el nombre."
      );
    }

    const product = new Product({
      name: name,
      slug: productSlug,
      description: description,
      imageURL: imagePath,
      categorySlug: categorySlug,
      price: parseFloat(price),
      stock: parseInt(stock),
      unitType: unitType,
      isAvailable: isAvailable == "true",
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("Error al crear producto:", error);
    const status =
      error.statusCode || error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
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
    imageURL, // URL de texto (si no hay archivo nuevo)
    categorySlug,
    unitType,
    isAvailable,
  } = req.body;

  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      // Validar categoría si cambia
      if (categorySlug && product.categorySlug !== categorySlug) {
        const categoryExists = await Category.findOne({ slug: categorySlug });
        if (!categoryExists) {
          res.status(400);
          throw new Error(
            'El nuevo "categorySlug" especificado no corresponde a una categoría existente.'
          );
        }
      }

      // 🟢 LÓGICA DE ACTUALIZACIÓN DE IMAGEN CORREGIDA
      let finalImageURL = product.imageURL; // Empezamos con la actual

      if (req.file) {
        // CASO 1: Hay un archivo nuevo subido por Multer
        // Construimos la ruta pública tal como la espera el servidor estático
        finalImageURL = `/uploads/products/${req.file.filename}`;
      } else if (imageURL) {
        // CASO 2: No hay archivo nuevo, pero se envió una URL de texto (ej. la vieja)
        finalImageURL = imageURL;
      }
      // CASO 3: Si no hay ni archivo ni texto, se mantiene la original (finalImageURL)

      // Actualizar campos
      // Usamos || para strings, pero cuidado con números (0 es false).
      // Para números y booleanos es mejor verificar undefined si quieres permitir 0 o false.

      product.name = name || product.name;
      product.price = price !== undefined ? price : product.price;
      product.stock = stock !== undefined ? stock : product.stock;
      product.description = description || product.description;
      product.categorySlug = categorySlug || product.categorySlug;
      product.unitType = unitType || product.unitType;

      if (price !== undefined) {
        product.price = parseFloat(price);
      }
      // 3. Asignar stock: Convertir a entero si el valor está presente
      if (stock !== undefined) {
        product.stock = parseInt(stock, 10);
      }

      // Asignar la imagen calculada
      product.imageURL = finalImageURL;

      // isAvailable puede ser false, así que verificamos si es undefined
      if (isAvailable !== undefined) {
        // El valor llega como cadena "true" o "false" desde el FormData,
        // por lo que comparamos con la cadena "true".
        product.isAvailable = isAvailable === "true";
      }

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
    const product = await Product.findOne({ slug: req.params.slug });

    if (product) {
      await product.deleteOne();
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
