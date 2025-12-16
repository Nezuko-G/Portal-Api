import Joi from "joi";

export const createExperienceLevelSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().trim().required().messages({
      "string.base": "Title (English) must be a string",
      "string.empty": "Title (English) is required",
      "any.required": "Title (English) is required",
    }),
    ar: Joi.string().trim().required().messages({
      "string.base": "Title (Arabic) must be a string",
      "string.empty": "Title (Arabic) is required",
      "any.required": "Title (Arabic) is required",
    }),
  }).required().messages({
    "object.base": "Title must be an object with 'en' and 'ar' fields",
    "any.required": "Title is required",
  }),
  minYears: Joi.number().min(0).required().messages({
    "number.base": "minYears must be a number",
    "number.min": "minYears cannot be negative",
    "any.required": "minYears is required",
  }),
  maxYears: Joi.number().min(Joi.ref('minYears')).optional().messages({
    "number.base": "maxYears must be a number",
    "number.min": "maxYears cannot be less than minYears",
  }),
  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});

export const updateExperienceLevelSchema = Joi.object({
  title: Joi.object({
    en: Joi.string().trim().required().messages({
      "string.base": "Title (English) must be a string",
      "string.empty": "Title (English) cannot be empty",
      "any.required": "Title (English) is required",
    }),
    ar: Joi.string().trim().required().messages({
      "string.base": "Title (Arabic) must be a string",
      "string.empty": "Title (Arabic) cannot be empty",
      "any.required": "Title (Arabic) is required",
    }),
  }).optional().messages({
    "object.base": "Title must be an object with 'en' and 'ar' fields",
  }),
  minYears: Joi.number().min(0).optional().messages({
    "number.base": "minYears must be a number",
    "number.min": "minYears cannot be negative",
  }),
  maxYears: Joi.number().min(Joi.ref('minYears')).optional().messages({
    "number.base": "maxYears must be a number",
    "number.min": "maxYears cannot be less than minYears",
  }),
  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});