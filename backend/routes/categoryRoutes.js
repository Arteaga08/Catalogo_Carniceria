// backend/routes/categoryRoutes.js
import express from "express";
const router = express.Router();
import {
  createCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  validateCategory,
  validateCategorySlugParam,
  validateSlugParam,
} from "../middleware/validationMiddleware.js";

import { uploadCategories } from "../middleware/uploadMiddleware.js";

router
  .route("/")
  .post(protect, admin, uploadCategories.single("image"), validateCategory, createCategory) // Validar creación de categoría
  .get(getCategories);

router
  .route("/:slug")
  .get( getCategoryBySlug)
  .put(
    protect,
    admin,
    validateSlugParam,
    uploadCategories.single("image"),
    validateCategory,
    updateCategory
  ) // Validar slug y datos de categoría
  .delete(protect, admin, validateSlugParam, deleteCategory); // Validar slug al eliminar

export default router;
