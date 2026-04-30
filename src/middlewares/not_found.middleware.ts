import { NotFoundError } from "../utils/error.js";
import type { Request, Response, NextFunction } from "express";

export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};
