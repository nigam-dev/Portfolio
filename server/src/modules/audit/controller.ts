import { Request, Response, NextFunction } from 'express';
import AuditLog from '../../models/AuditLog';
import { sendSuccess } from '../../utils/response';

export const getAuditLogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resource, action, limit = '50', skip = '0' } = req.query;
    
    const query: any = {};
    
    if (resource) {
      query.resource = resource;
    }
    
    if (action) {
      query.action = action;
    }
    
    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string))
      .skip(parseInt(skip as string))
      .select('-__v');
    
    const total = await AuditLog.countDocuments(query);
    
    return sendSuccess(res, { logs, total, limit: parseInt(limit as string), skip: parseInt(skip as string) });
  } catch (error) {
    next(error);
  }
};
