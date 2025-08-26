import express from 'express';
import { getChildDevelopment, createChildActivity, getRecommendationActivity } from '../controllers/child.controller';

const router = express.Router();

router.get('/child/getChildDevelopment/:id', getChildDevelopment);
router.post('/child/createChildActivity', createChildActivity);
router.get('/child/getRecommendationActivity/:id', getRecommendationActivity);

export default router;