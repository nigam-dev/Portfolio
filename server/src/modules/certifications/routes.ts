import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth';
import * as certificationController from './controller';

const router = Router();

router.get('/', certificationController.getCertifications);
router.post('/', authenticate, requireAdmin, certificationController.createCertification);
router.patch('/:id', authenticate, requireAdmin, certificationController.updateCertification);
router.delete('/:id', authenticate, requireAdmin, certificationController.deleteCertification);

export default router;
