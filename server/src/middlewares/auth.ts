import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../utils/response';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/src/constants';
import { UserRole } from '../../../shared/src/types';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.portfolio_token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    const decoded = jwt.verify(token, config.jwt.secret) as {
      id: string;
      email: string;
      role: UserRole;
    };
    
    const user = await User.findById(decoded.id).select('_id email role isActive');
    
    if (!user || !user.isActive) {
      throw new ApiError(HTTP_STATUS.UNAUTHORIZED, ERROR_MESSAGES.UNAUTHORIZED);
    }
    
    req.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    
    next();
  } catch (error) {
    next(error);
  }
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user || req.user.role !== UserRole.ADMIN) {
    throw new ApiError(HTTP_STATUS.FORBIDDEN, ERROR_MESSAGES.ADMIN_ONLY);
  }
  next();
};
