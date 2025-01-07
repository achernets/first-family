import express from 'express';
import { getAll, create } from '../controllers/post.controller';

const router = express.Router();

router.get('/community/getAllPost', getAll);
router.post('/community', create);

export default router;