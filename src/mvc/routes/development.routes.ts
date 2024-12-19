import express from 'express';
import { getAllDevelopment, updateDevelopment, createDevelopment } from '../controllers/development.controller';

const router = express.Router();

router.get('/development/getAllDevelopments', getAllDevelopment);
router.post('/development', createDevelopment);
router.patch('/development/:id', updateDevelopment);

export default router;