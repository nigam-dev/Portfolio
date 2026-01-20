import { Router } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../../middlewares/auth';
import * as educationController from './controller';

const router = Router();

router.get('/', optionalAuth, educationController.getEducations);
router.post('/', authenticate, requireAdmin, educationController.createEducation);
router.patch('/:id', authenticate, requireAdmin, educationController.updateEducation);
router.delete('/:id', authenticate, requireAdmin, educationController.deleteEducation);

export default router;
