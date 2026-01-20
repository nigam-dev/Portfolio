import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth';
import * as educationController from './controller';

const router = Router();

router.get('/', educationController.getEducations);
router.post('/', authenticate, requireAdmin, educationController.createEducation);
router.patch('/:id', authenticate, requireAdmin, educationController.updateEducation);
router.delete('/:id', authenticate, requireAdmin, educationController.deleteEducation);

export default router;
