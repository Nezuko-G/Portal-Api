import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";

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
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  ApiResponse.error(res, message, statusCode, err.data, err.conflicts);
};

export default globalErrorHandler;
