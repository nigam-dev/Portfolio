import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth';
import * as profileController from './controller';

const router = Router();

router.get('/', profileController.getProfile);
router.patch('/', authenticate, requireAdmin, profileController.updateProfile);

export default router;
