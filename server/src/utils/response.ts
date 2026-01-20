import { Response } from 'express';
import type { ApiResponse } from '../../../shared/src/types';
import { HTTP_STATUS } from '../../../shared/src/constants';

export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK,
  meta?: any
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  error: string,
  statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR
): Response => {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
};
