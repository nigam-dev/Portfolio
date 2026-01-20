import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import Skill from '../../models/Skill';
import { sendSuccess, sendError, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import AuditLog from '../../models/AuditLog';

export const getSkills = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { category, visibility } = req.query;
    
    const query: any = {};
    
    // Public users only see visible skills
    if (!req.user || req.user.role !== 'admin') {
      query.visibility = true;
    } else if (visibility !== undefined) {
      query.visibility = visibility === 'true';
    }
    
    if (category) query.category = category;
    
    const skills = await Skill.find(query)
      .sort({ order: 1, createdAt: -1 })
      .select('-__v');
    
    return sendSuccess(res, skills);
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const skillData = {
      ...req.body,
      createdBy: req.user!.id,
    };
    
    const skill = await Skill.create(skillData);
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'CREATE',
      resource: 'SKILL',
      resourceId: skill._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, skill, 'Skill created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!skill) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Skill not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'UPDATE',
      resource: 'SKILL',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, skill, 'Skill updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const skill = await Skill.findByIdAndDelete(id);
    
    if (!skill) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Skill not found');
    }
    
    await AuditLog.create({
      userId: req.user!.id,
      action: 'DELETE',
      resource: 'SKILL',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, null, 'Skill deleted successfully', HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
