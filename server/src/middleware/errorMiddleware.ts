import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/CustomError';

// Middleware to handle 404 Not Found errors
const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// General error handler middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Check if the status code is a valid HTTP status code, otherwise default to 500
  const statusCode = (res.statusCode && res.statusCode !== 200) ? res.statusCode : 500;
  res.status(statusCode);

  // Send a JSON response with the error message
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };