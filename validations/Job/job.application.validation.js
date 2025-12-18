import Joi from "joi";

const objectId = Joi.string().hex().length(24);

// Validation for applying to a job (no body needed, jobId in params)
export const applyToJobSchema = Joi.object({
  jobId: objectId.required().messages({
    "any.required": "Job ID is required",
    "string.length": "Job ID must be a valid ObjectId",
    "string.hex": "Job ID must be a valid ObjectId",
  }),
});

// Validation for getting applications with query params
export const getApplicationsQuerySchema = Joi.object({
  status: Joi.string().valid("pending", "accepted", "rejected").messages({
    "any.only": "Status must be pending, accepted, or rejected",
  }),
  page: Joi.number().integer().min(1).default(1).messages({
    "number.base": "Page must be a number",
    "number.min": "Page must be at least 1",
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    "number.base": "Limit must be a number",
    "number.min": "Limit must be at least 1",
    "number.max": "Limit cannot exceed 100",
  }),
});

// Validation for updating application status
export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string().valid("pending", "accepted", "rejected").required().messages({
    "any.required": "Status is required",
    "any.only": "Status must be pending, accepted, or rejected",
  }),
});
