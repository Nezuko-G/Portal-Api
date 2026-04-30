import { BadRequestError } from "../utils/error.js";
import type { Request, Response, NextFunction } from "express";
import type { ObjectSchema, ValidationErrorItem } from "joi";

export const validate = (
  schema: ObjectSchema | ((req: Request) => ObjectSchema),
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Get localized schema if it's a function
    const localizedSchema = typeof schema === "function" ? schema(req) : schema;

    const { error, value } = localizedSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      const messages = error.details.map(
        (err: ValidationErrorItem) => err.message,
      );
      return next(new BadRequestError(messages.join(", ")));
    }

    req.body = value;
    next();
  };
};
