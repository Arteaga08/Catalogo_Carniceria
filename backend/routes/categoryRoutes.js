import express from 'express';
import { getCategories } from '../controllers/categoryController.js';

const router = express.Router();

// Define la ruta GET /
router.route('/').get(getCategories);

export default router;