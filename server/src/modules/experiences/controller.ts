import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import Experience from '../../models/Experience';
import { sendSuccess, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import AuditLog from '../../models/AuditLog';

export const getExperiences = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { visibility } = req.query;
    
    const query: any = {};
    
    if (!req.user || req.user.role !== 'admin') {
      query.visibility = true;
    } else if (visibility !== undefined) {
      query.visibility = visibility === 'true';
    }
    
    const experiences = await Experience.find(query)
      .sort({ order: 1, startDate: -1 })
      .select('-__v');
    
    return sendSuccess(res, experiences);
  } catch (error) {
    next(error);
  }
};

export const createExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const experience = await Experience.create({
      ...req.body,
      createdBy: req.user!.id,
    });
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'CREATE',
      resource: 'EXPERIENCE',
      resourceId: experience._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, experience, 'Experience created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const updateExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const experience = await Experience.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!experience) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Experience not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'UPDATE',
      resource: 'EXPERIENCE',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, experience, 'Experience updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteExperience = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const experience = await Experience.findByIdAndDelete(id);
    
    if (!experience) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Experience not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'DELETE',
      resource: 'EXPERIENCE',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, null, 'Experience deleted successfully', HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
