import express from 'express';
import { getChildDevelopment, createChildActivity } from '../controllers/child.controller';

const router = express.Router();

router.get('/child/getChildDevelopment/:id', getChildDevelopment);
router.post('/child/createChildActivity', createChildActivity);

export default router;