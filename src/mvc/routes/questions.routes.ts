import express from 'express';
import { getQuestions, finishInterrgation } from '../controllers/questions.controller';

const router = express.Router();

router.get('/questions/getQuestions', getQuestions);
router.post('/questions/finishInterrgation', finishInterrgation);

export default router;