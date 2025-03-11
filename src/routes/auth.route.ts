import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { getProfile, login, register } from '../controller/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticate, getProfile);

export default router;