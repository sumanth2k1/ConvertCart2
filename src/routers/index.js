import express from 'express';
import dishRoutes from './dishRoutes.js';

const router = express.Router();

router.use('/search', dishRoutes);

export default router;