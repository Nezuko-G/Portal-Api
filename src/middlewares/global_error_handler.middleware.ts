import type { Request, Response, NextFunction } from "express";

interface CustomError extends Error {
  statusCode?: number;
  message: string;
  conflicts?: Record<string, any>;
  data?: any;
}

const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  const errorResponse: Record<string, any> = {
    status,
    message,
  };

  if (err.conflicts) {
    errorResponse.conflicts = err.conflicts;
  }

  if (err.data) {
    errorResponse.errors = err.data;
  }

  res.status(status).json(errorResponse);
};

export default globalErrorHandler;
