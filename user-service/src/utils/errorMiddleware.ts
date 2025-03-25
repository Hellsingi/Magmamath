import { Request, Response, NextFunction } from 'express';
import logger from './logger';

export const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error: %s', err.message, { stack: err.stack });
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
};
