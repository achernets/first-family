import express from 'express';
import { getAll, create, postLike, postUnLike, 
    getAllCommentsByPost, createComment, commentLike, commentUnLike, 
    getAllMyPosts
} from '../controllers/post.controller';

const router = express.Router();

router.get('/community/getAllPost', getAll);
router.get('/community/getAllMyPost', getAllMyPosts);
router.post('/community/post', create);
router.get('/community/post/like/:id', postLike);
router.get('/community/post/unlike/:id', postUnLike);
router.get('/community/post/:id/comments/', getAllCommentsByPost);
router.post('/community/comment', createComment);
router.get('/community/comment/like/:id', commentLike);
router.get('/community/comment/unlike/:id', commentUnLike);


export default router;