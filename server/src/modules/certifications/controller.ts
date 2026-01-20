import { Request, Response, NextFunction } from 'express';
import Certification from '../../models/Certification';
import { sendSuccess, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import AuditLog from '../../models/AuditLog';

export const getCertifications = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { visibility } = req.query;
    
    const query: any = {};
    
    if (!req.user || req.user.role !== 'admin') {
      query.visibility = true;
    } else if (visibility !== undefined) {
      query.visibility = visibility === 'true';
    }
    
    const certifications = await Certification.find(query)
      .sort({ order: 1, issueDate: -1 })
      .select('-__v');
    
    return sendSuccess(res, certifications);
  } catch (error) {
    next(error);
  }
};

export const createCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const certification = await Certification.create({
      ...req.body,
      createdBy: req.user!.id,
    });
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'CREATE',
      resource: 'CERTIFICATION',
      resourceId: certification._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, certification, 'Certification created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const updateCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const certification = await Certification.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!certification) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Certification not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'UPDATE',
      resource: 'CERTIFICATION',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, certification, 'Certification updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteCertification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const certification = await Certification.findByIdAndDelete(id);
    
    if (!certification) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Certification not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'DELETE',
      resource: 'CERTIFICATION',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, null, 'Certification deleted successfully');
  } catch (error) {
    next(error);
  }
};
