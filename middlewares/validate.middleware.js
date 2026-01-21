import { BadRequestError } from "../utils/error.js";

export const validate = (schema) => {
  return (req, res, next) => {
    // Get localized schema if it's a function
    const localizedSchema = typeof schema === "function" ? schema(req) : schema;

    const { error, value } = localizedSchema.validate(req.body, {
      abortEarly: true,
    });

    if (error) {
      return next(new BadRequestError(error.details.map((err) => err.message)));
    }

    req.body = value;
    next();
  };
};
