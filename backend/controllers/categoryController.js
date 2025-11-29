// backend/controllers/categoryController.js (VERSIÓN COMPLETA)
import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import slugify from "slugify";

// 1. getCategories (ya la tienes, solo la envolvemos en asyncHandler)
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({
    categoryPrincipal: 1,
    order: 1,
  });
  const groupedCategories = categories.reduce((acc, category) => {
    const principal = category.categoryPrincipal;
    if (!acc[principal]) {
      acc[principal] = [];
    }
    acc[principal].push(category);
    return acc;
  }, {});
  res.json(groupedCategories);
});

// 2. getCategoryBySlug (NUEVA FUNCIÓN)
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

// 3. createCategory (NUEVA FUNCIÓN)
const createCategory = asyncHandler(async (req, res) => {
  const { name, description, categoryPrincipal, iconURL, imageURL, order } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const categoryExists = await Category.findOne({
    $or: [{ name: { $regex: new RegExp(`^${name}$`, "i") } }, { slug }],
  });
  if (categoryExists) {
    res.status(400);
    throw new Error("Ya existe una categoría con este nombre o slug");
  }
  const category = new Category({
    name,
    slug,
    description,
    categoryPrincipal: categoryPrincipal,
    order: order || 0,
    iconURL,
    imageURL,
  });
  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// 4. updateCategory (NUEVA FUNCIÓN)
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description, categoryPrincipal, order, iconURL, imageURL } =
    req.body;
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    if (name && name !== category.name) {
      const newSlug = slugify(name, { lower: true, strict: true });
      const categoryWithNewName = await Category.findOne({
        $or: [
          { name: { $regex: new RegExp(`^${name}$`, "i") } },
          { slug: newSlug },
        ],
        _id: { $ne: category._id },
      });
      if (categoryWithNewName) {
        res.status(400);
        throw new Error(
          "Ya existe otra categoría con el nombre o slug actualizado"
        );
      }
      category.name = name;
      category.slug = newSlug;
    }
    category.description = description ?? category.description;
    category.categoryPrincipal =
      categoryPrincipal ?? category.categoryPrincipal;
    category.order = order ?? category.order;
    category.iconURL = iconURL ?? category.iconURL; // Actualizar
    category.imageURL = imageURL ?? category.imageURL;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

// 5. deleteCategory (NUEVA FUNCIÓN)
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug });
  if (category) {
    await category.deleteOne();
    res.json({ message: "Categoría eliminada" });
  } else {
    res.status(404);
    throw new Error("Categoría no encontrada");
  }
});

export {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
