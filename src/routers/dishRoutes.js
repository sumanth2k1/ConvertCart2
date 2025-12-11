import express from 'express';
import { searchDishes } from '../controllers/dishController.js';

const router = express.Router();

router.get('/dishes', searchDishes);

export default router;