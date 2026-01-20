import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import Education from '../../models/Education';
import { sendSuccess, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import AuditLog from '../../models/AuditLog';

export const getEducations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { visibility } = req.query;
    
    const query: any = {};
    
    if (!req.user || req.user.role !== 'admin') {
      query.visibility = true;
    } else if (visibility !== undefined) {
      query.visibility = visibility === 'true';
    }
    
    const educations = await Education.find(query)
      .sort({ order: 1, startDate: -1 })
      .select('-__v');
    
    return sendSuccess(res, educations);
  } catch (error) {
    next(error);
  }
};

export const createEducation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const education = await Education.create({
      ...req.body,
      createdBy: req.user!.id,
    });
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'CREATE',
      resource: 'EDUCATION',
      resourceId: education._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, education, 'Education created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const updateEducation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const education = await Education.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!education) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Education not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'UPDATE',
      resource: 'EDUCATION',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, education, 'Education updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteEducation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const education = await Education.findByIdAndDelete(id);
    
    if (!education) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Education not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'DELETE',
      resource: 'EDUCATION',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, null, 'Education deleted successfully');
  } catch (error) {
    next(error);
  }
};
