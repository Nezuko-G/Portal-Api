import { ForbiddenError, UnAuthorizedError } from "../utils/error.js";
import type { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = (req as any).user?.role;

    if (!userRole) {
      return next(new UnAuthorizedError("Unauthorized"));
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new ForbiddenError("Forbidden: You don't have permission"));
    }
    next();
  };
};
