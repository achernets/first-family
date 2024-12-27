import express from 'express';
import { getAllCategories, getAllCategoriesAdmin, createCategory, updateCategory, deleteCategory } from '../controllers/category.controller';

const router = express.Router();

router.get('/category/getAllCategories', getAllCategories);
router.get('/admin/category/getAllCategories', getAllCategoriesAdmin);
router.post('/admin/category', createCategory);
router.patch('/admin/category/:id', updateCategory);
router.delete('/admin/category/:id', deleteCategory);

export default router;