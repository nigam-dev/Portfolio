import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth';
import * as projectController from './controller';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:slug', projectController.getProjectBySlug);

// Admin routes
router.post('/', authenticate, requireAdmin, projectController.createProject);
router.patch('/:id', authenticate, requireAdmin, projectController.updateProject);
router.delete('/:id', authenticate, requireAdmin, projectController.deleteProject);

export default router;
