import express from 'express';
import { signIn, signUp, getMe, getAll, getById } from '../controllers/user.controller';

const router = express.Router();

router.get('/getMe', getMe);
router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.get('/users/getAll', getAll);
router.get('/users/:id', getById);

export default router;