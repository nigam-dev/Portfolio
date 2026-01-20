import { Request, Response, NextFunction } from 'express';
import { ApiError, sendError } from '../utils/response';
import logger from '../utils/logger';
import { HTTP_STATUS, ERROR_MESSAGES } from '../../../shared/src/constants';

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });
  
  if (err instanceof ApiError) {
    return sendError(res, err.message, err.statusCode);
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return sendError(res, err.message, HTTP_STATUS.BAD_REQUEST);
  }
  
  // Mongoose duplicate key error
  if (err.name === 'MongoError' && (err as any).code === 11000) {
    return sendError(res, 'Duplicate entry', HTTP_STATUS.CONFLICT);
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid token', HTTP_STATUS.UNAUTHORIZED);
  }
  
  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Token expired', HTTP_STATUS.UNAUTHORIZED);
  }
  
  return sendError(res, ERROR_MESSAGES.INTERNAL_ERROR, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return sendError(res, `Route ${req.originalUrl} not found`, HTTP_STATUS.NOT_FOUND);
};
