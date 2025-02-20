import express from 'express';
import { signIn, signUp, getMe, getAll, getById, isExistEmail, userUpdate, changePassword, resetPassword } from '../controllers/user.controller';
import { createUpdateChilds } from '../controllers/child.controller';

const router = express.Router();

router.get('/getMe', getMe);
router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/resetPassword', resetPassword);
router.get('/users/getAll', getAll);
router.get('/users/:id', getById);
router.get('/users/email/:email', isExistEmail);
router.post('/users/:id', userUpdate);
router.post('/users/:id/changePassword', changePassword);
router.post('/users/:id/editMembers', createUpdateChilds);


export default router;