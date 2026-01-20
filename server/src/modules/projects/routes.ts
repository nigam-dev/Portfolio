import { Router } from 'express';
import { authenticate, requireAdmin, optionalAuth } from '../../middlewares/auth';
import * as projectController from './controller';

const router = Router();

// Public routes (with optional auth to detect admin)
router.get('/', optionalAuth, projectController.getProjects);
router.get('/:slug', optionalAuth, projectController.getProjectBySlug);

// Admin routes
router.post('/', authenticate, requireAdmin, projectController.createProject);
router.patch('/:id', authenticate, requireAdmin, projectController.updateProject);
router.delete('/:id', authenticate, requireAdmin, projectController.deleteProject);

export default router;
