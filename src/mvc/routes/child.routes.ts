import express from 'express';
import { getChildDevelopment } from '../controllers/child.controller';

const router = express.Router();

router.get('/child/getChildDevelopment', getChildDevelopment);

export default router;