// backend/middleware/validationMiddleware.js
import { body, param, query, validationResult } from "express-validator";
import Category from "../models/categoryModel.js"; // Para validar existencia de categoría
import User from "../models/userModel.js";
import Product from "../models/ProductModel.js";

// Middleware para manejar los resultados de la validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array(); // Captura los errores en una variable
    console.error("Validation Errors Detected:", errorMessages);

    if (res.headersSent) {
      console.warn(
        "handleValidationErrors: Headers already sent, cannot send validation error response."
      );
      return next(new Error("Validation failed but headers already sent."));
    }

    return res.status(400).json({
      message: "Validation Failed", // Un mensaje general para el cliente
      errors: errorMessages.map((err) => ({
        // Mapea cada error para un formato más limpio si lo deseas, o envía el array crudo
        message: err.msg,
        field: err.path,
        value: err.value,
      })),
      // O simplemente: errors: errorMessages, // Si quieres el array de errores tal cual viene de express-validator
    });
  }
  next();
};

// --- Validaciones para Usuarios ---

const validateRegisterUser = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .isEmail()
    .withMessage("El email debe ser una dirección de correo válida")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("Ya existe un usuario con este email");
      }
    }),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("role")
    .optional()
    .isIn(["admin", "editor", "user"])
    .withMessage("Rol inválido. Los roles permitidos son admin, editor o user"),
  handleValidationErrors,
];

const validateLoginUser = [
  body("email").isEmail().withMessage("Ingresa un email válido"),
  body("password").notEmpty().withMessage("La contraseña es requerida"),
  handleValidationErrors,
];

const validateUpdateUserProfile = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Ingresa un email válido")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      if (user && user._id.toString() !== req.user._id.toString()) {
        throw new Error("Ya existe otro usuario con este email");
      }
    }),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  handleValidationErrors,
];

const validateUpdateUser = [
  param("id").isMongoId().withMessage("ID de usuario inválido"),
  body("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("El nombre debe tener al menos 3 caracteres"),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Ingresa un email válido")
    .custom(async (value, { req }) => {
      const user = await User.findOne({ email: value });
      // Si el email ya existe y no pertenece al usuario que estamos actualizando
      if (user && user._id.toString() !== req.params.id.toString()) {
        throw new Error("Ya existe otro usuario con este email");
      }
    }),
  body("role")
    .optional()
    .isIn(["admin", "editor", "user"])
    .withMessage("Rol inválido. Los roles permitidos son admin, editor o user"),
  handleValidationErrors,
];

// --- Validaciones para Categorías ---

const validateCategory = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre de la categoría es requerido")
    .isLength({ min: 2 })
    .withMessage("El nombre de la categoría debe tener al menos 2 caracteres")
    .custom(async (value, { req }) => {
      const query = { name: { $regex: new RegExp(`^${value}$`, "i") } };
      if (req.method === "PUT" && req.params.slug) {
        const existingCategory = await Category.findOne({
          slug: req.params.slug,
        });
        if (existingCategory) {
          query._id = { $ne: existingCategory._id };
        }
      }
      const category = await Category.findOne(query);
      if (category) {
        throw new Error("Ya existe una categoría con este nombre");
      }
    }),
  body("description")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("La descripción debe tener al menos 5 caracteres"),
  // <<<<<<<<<<<<<<<<<<<< CORRECCIÓN AQUÍ >>>>>>>>>>>>>>>>>>>>>>
  body("categoryPrincipal")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La categoría principal es requerida"), // Ahora es requerida
  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  body("order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El orden debe ser un número entero no negativo"),
  // Añadimos validaciones para las URLs de imagen si se proporcionan
  body("iconURL")
    .optional()
    .isURL()
    .withMessage("La URL del icono debe ser una URL válida"),
  body("imageURL")
    .optional()
    .isURL()
    .withMessage("La URL de la imagen debe ser una URL válida"),
  handleValidationErrors,
];

const validateCategorySlugParam = [
  param("categorySlug")
    .trim()
    .notEmpty()
    .withMessage("El slug de la categoría es requerido"),
  handleValidationErrors,
];

const validateSlugParam = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("El slug es requerido para esta operación (param: slug)."),
  handleValidationErrors,
];

// --- Validaciones para Productos ---

const validateProduct = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("El nombre del producto es requerido")
    .isLength({ min: 3 })
    .withMessage("El nombre del producto debe tener al menos 3 caracteres")
    .custom(async (value, { req }) => {
      const query = { name: { $regex: new RegExp(`^${value}$`, "i") } };
      // Para PUT, excluye el producto que se está actualizando por su slug
      if (req.method === "PUT" && req.params.slug) {
        const existingProduct = await Product.findOne({
          slug: req.params.slug,
        });
        if (existingProduct) {
          query._id = { $ne: existingProduct._id };
        }
      }
      const product = await Product.findOne(query);
      if (product) {
        throw new Error("Ya existe un producto con este nombre");
      }
    }),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("La descripción del producto es requerida")
    .isLength({ min: 10 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),
  body("price")
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage("El precio debe ser un número positivo"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("El stock debe ser un número entero no negativo"),
  body("imageURL")
    .optional() // Permite que no se envíe al crear, pero si se envía, validarlo
    .isURL()
    .withMessage("La URL de la imagen debe ser una URL válida"),
  body("categorySlug")
    .optional()
    .notEmpty()
    .withMessage("El slug de la categoría es requerido")
    .custom(async (value) => {
      const category = await Category.findOne({ slug: value });
      if (!category) {
        throw new Error("La categoría especificada no existe");
      }
    }),
  body("variations")
    .optional()
    .isArray()
    .withMessage("Las variaciones deben ser un array")
    .notEmpty()
    .withMessage("Debe haber al menos una variación"),
  body("variations.*.unitName") // Validar cada elemento dentro del array de variaciones
    .trim()
    .notEmpty()
    .withMessage("El nombre de la unidad de variación es requerido"),
  body("variations.*.price")
    .isFloat({ min: 0.01 })
    .withMessage("El precio de la variación debe ser un número positivo"),
  body("variations.*.unitReference")
    .trim()
    .notEmpty()
    .withMessage("La referencia de la unidad de variación es requerida"),
  body("variations.*.approxWeightGrams")
    .isInt({ min: 1 })
    .withMessage(
      "El peso aproximado en gramos debe ser un número entero positivo"
    ),
  body("variations.*.isIntegerUnit")
    .isBoolean()
    .withMessage("isIntegerUnit debe ser un valor booleano"),
  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable debe ser un valor booleano"),
  handleValidationErrors,
];

const validateProductSlugParam = [
  param("slug")
    .trim()
    .notEmpty()
    .withMessage("El slug del producto es requerido"),
  handleValidationErrors,
];

export {
  handleValidationErrors,
  validateRegisterUser,
  validateLoginUser,
  validateUpdateUserProfile,
  validateUpdateUser,
  validateCategory,
  validateCategorySlugParam,
  validateProduct,
  validateProductSlugParam,
  validateSlugParam,
};
