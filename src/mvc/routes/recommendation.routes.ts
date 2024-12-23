import express from 'express';
import { getAll, create, update, remove } from '../controllers/recommendation.controller';

const router = express.Router();

router.get('/recommendations/getAll', getAll);
router.post('/recommendations', create);
router.patch('/recommendations/:id', update);
router.delete('/recommendations/:id', remove);

export default router;