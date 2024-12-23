import express from 'express';
import { getAll, create, update, remove } from '../controllers/offers.controller';

const router = express.Router();

router.get('/offers/getAll', getAll);
router.post('/offers', create);
router.patch('/offers/:id', update);
router.delete('/offers/:id', remove);

export default router;