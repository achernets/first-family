import express from 'express';
import { signIn, signUp, getMe, getAll, getById, isExistEmail, userUpdate, changePassword, resetPassword, onBoardPollHandler, getMeActivityChilds } from '../controllers/user.controller';
import { createUpdateChilds } from '../controllers/child.controller';

const router = express.Router();

router.get('/getMe', getMe);
router.post('/signIn', signIn);
router.post('/signUp', signUp);
router.post('/resetPassword', resetPassword);
router.get('/users/getAll', getAll);
router.get('/users/getMeActivityChilds', getMeActivityChilds);
router.get('/users/email/:email', isExistEmail);
router.get('/users/:id', getById);
router.post('/users/:id', userUpdate);
router.post('/users/:id/changePassword', changePassword);
router.post('/users/:id/editMembers', createUpdateChilds);
router.post('/users/:id/onBoardPoll', onBoardPollHandler);


export default router;