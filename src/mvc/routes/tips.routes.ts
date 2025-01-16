import express from 'express';
import { getAll, create, update, remove, markAsView } from '../controllers/tips.controller';

const router = express.Router();

router.get('/tips/getAll', getAll);
router.post('/tips', create);
router.get('/tips/markAsView/:id/', markAsView);
router.patch('/tips/:id', update);
router.delete('/tips/:id', remove);

export default router;