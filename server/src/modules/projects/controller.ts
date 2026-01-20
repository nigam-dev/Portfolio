import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middlewares/auth';
import Project from '../../models/Project';
import { sendSuccess, sendError, ApiError } from '../../utils/response';
import { HTTP_STATUS } from '../../../../shared/src/constants';
import { ContentStatus } from '../../../../shared/src/types';
import AuditLog from '../../models/AuditLog';

export const getProjects = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status,
      featured,
      search,
    } = req.query;
    
    const query: any = {};
    
    // Public users only see published and visible projects
    if (!req.user || req.user.role !== 'admin') {
      query.status = ContentStatus.PUBLISHED;
      query.visibility = true;
    } else {
      // Admin can filter by status
      if (status) query.status = status;
      if (typeof featured === 'string') query.featured = featured === 'true';
    }
    
    if (category) query.category = category;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
      ];
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .select('-__v'),
      Project.countDocuments(query),
    ]);
    
    return sendSuccess(res, projects, undefined, HTTP_STATUS.OK, {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectBySlug = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    
    const query: any = { slug };
    
    // Public users only see published and visible projects
    if (!req.user || req.user.role !== 'admin') {
      query.status = ContentStatus.PUBLISHED;
      query.visibility = true;
    }
    
    const project = await Project.findOne(query).select('-__v');
    
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    
    // Increment view count
    if (!project.metrics) {
      project.metrics = { views: 0 };
    }
    project.metrics.views = (project.metrics.views || 0) + 1;
    await project.save();
    
    return sendSuccess(res, project);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const projectData = {
      ...req.body,
      createdBy: req.user!.id,
    };
    
    const project = await Project.create(projectData);
    
    // Log action
    await AuditLog.create({
      userId: req.user!.id,
      action: 'CREATE',
      resource: 'PROJECT',
      resourceId: project._id.toString(),
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, project, 'Project created successfully', HTTP_STATUS.CREATED);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    
    const oldData = project.toObject();
    
    Object.assign(project, req.body);
    await project.save();
    
    // Log action
    await AuditLog.create({
      userId: req.user!.id,
      action: 'UPDATE',
      resource: 'PROJECT',
      resourceId: project._id.toString(),
      changes: { old: oldData, new: project.toObject() },
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, project, 'Project updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const project = await Project.findById(id);
    
    if (!project) {
      throw new ApiError(HTTP_STATUS.NOT_FOUND, 'Project not found');
    }
    
    await project.deleteOne();
    
    // Log action
    await AuditLog.create({
      userId: req.user!.id,
      action: 'DELETE',
      resource: 'PROJECT',
      resourceId: id,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    
    return sendSuccess(res, null, 'Project deleted successfully', HTTP_STATUS.NO_CONTENT);
  } catch (error) {
    next(error);
  }
};
