import express from 'express';
import { getAllRecommendation, createRecommendation, updateRecommendation } from '../controllers/recommendation.controller';

const router = express.Router();

router.get('/recommendation/getAllRecommendations', getAllRecommendation);
router.post('/recommendation', createRecommendation);
router.patch('/recommendation/:id', updateRecommendation);

export default router;