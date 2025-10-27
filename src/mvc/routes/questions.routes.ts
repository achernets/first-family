import express from 'express';
import { getQuestions } from '../controllers/questions.controller';

const router = express.Router();

router.get('/questions/getQuestions', getQuestions);

export default router;