import { Request, Response, NextFunction } from 'express';
import Profile from '../../models/Profile';
import { sendSuccess, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import AuditLog from '../../models/AuditLog';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: any = {};
    
    if (!req.user || req.user.role !== 'admin') {
      query.visibility = true;
    }
    
    const profile = await Profile.findOne(query).select('-__v');
    
    if (!profile) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Profile not found');
    }
    
    return sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let profile = await Profile.findOne({ userId: req.user!.id });
    
    if (!profile) {
      // Create profile if doesn't exist
      profile = await Profile.create({
        ...req.body,
        userId: req.user!.id,
        createdBy: req.user!.id,
      });
    } else {
      Object.assign(profile, req.body);
      await profile.save();
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: profile.isNew ? 'CREATE' : 'UPDATE',
      resource: 'PROFILE',
      resourceId: profile._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, profile, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};
