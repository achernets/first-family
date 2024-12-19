import express from 'express';
import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = express.Router();

router.get('/category/getAllCategories', getAllCategories);
router.post('/category', createCategory);
router.patch('/category/:id', updateCategory);
router.delete('/category/:id', deleteCategory);

export default router;