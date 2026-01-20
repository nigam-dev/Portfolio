import { Router } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../../middlewares/auth';
import * as experienceController from './controller';

const router = Router();

router.get('/', optionalAuth, experienceController.getExperiences);
router.post('/', authenticate, requireAdmin, experienceController.createExperience);
router.patch('/:id', authenticate, requireAdmin, experienceController.updateExperience);
router.delete('/:id', authenticate, requireAdmin, experienceController.deleteExperience);

export default router;
