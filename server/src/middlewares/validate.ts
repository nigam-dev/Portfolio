import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/response';
import { HTTP_STATUS } from '../../../shared/src/constants';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        throw new ApiError(
          HTTP_STATUS.BAD_REQUEST,
          JSON.stringify(errorMessages)
        );
      }
      next(error);
    }
  };
};
