import { Router } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../../middlewares/auth';
import * as profileController from './controller';

const router = Router();

router.get('/', optionalAuth, profileController.getProfile);
router.patch('/', authenticate, requireAdmin, profileController.updateProfile);

export default router;
