import { Router } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../../middlewares/auth';
import * as skillController from './controller';

const router = Router();

// Public routes
router.get('/', skillController.getSkills);

// Admin routes
router.post('/', authenticate, requireAdmin, skillController.createSkill);
router.patch('/:id', authenticate, requireAdmin, skillController.updateSkill);
router.delete('/:id', authenticate, requireAdmin, skillController.deleteSkill);

export default router;
