import express from 'express';
import { getChildDevelopment, createChildActivity, getRecommendationActivity, finishChildActivity } from '../controllers/child.controller';

const router = express.Router();

router.get('/child/getChildDevelopment/:id', getChildDevelopment);
router.post('/child/createChildActivity', createChildActivity);
router.get('/child/getRecommendationActivity/:id', getRecommendationActivity);
router.post('/child/finishChildActivity/:id', finishChildActivity);

export default router;