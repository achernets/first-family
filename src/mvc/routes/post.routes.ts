import express from 'express';
import { getAll, create, postLike, postUnLike } from '../controllers/post.controller';

const router = express.Router();

router.get('/community/getAllPost', getAll);
router.post('/community/post', create);
router.get('/community/post/like/:id', postLike);
router.get('/community/post/unlike/:id', postUnLike);

export default router;