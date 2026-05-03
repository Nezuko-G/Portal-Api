import Joi from "joi";
import type { Request } from "express";

type TranslationFunction = (
  key: string,
  options?: Record<string, any>,
) => string;

const objectId = Joi.string().hex().length(24);

// Validation for applying to a job (no body needed, jobId in params)
export const applyToJobSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    jobId: objectId.required().messages({
      "any.required": t("validation.job_id_required"),
      "string.length": t("validation.invalid_object_id"),
      "string.hex": t("validation.invalid_object_id"),
    }),
  });
};

// Validation for getting applications with query params
export const getApplicationsQuerySchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    status: Joi.string()
      .valid("pending", "accepted", "rejected")
      .messages({
        "any.only": t("validation.status_invalid"),
      }),
    page: Joi.number()
      .integer()
      .min(1)
      .default(1)
      .messages({
        "number.base": "Page must be a number",
        "number.min": t("validation.page_min"),
      }),
    limit: Joi.number()
      .integer()
      .min(1)
      .max(100)
      .default(10)
      .messages({
        "number.base": "Limit must be a number",
        "number.min": t("validation.limit_min"),
        "number.max": t("validation.limit_max"),
      }),
  });
};

// Validation for updating application status
export const updateApplicationStatusSchema = (
  req: Request,
): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    status: Joi.string()
      .valid("pending", "accepted", "rejected")
      .required()
      .messages({
        "any.required": t("validation.status_required"),
        "any.only": t("validation.status_invalid"),
      }),
  });
};
