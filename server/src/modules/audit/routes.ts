import { Router } from 'express';
import { authenticate, requireAdmin } from '../../middlewares/auth';
import * as auditController from './controller';

const router = Router();

router.get('/', authenticate, requireAdmin, auditController.getAuditLogs);

export default router;
