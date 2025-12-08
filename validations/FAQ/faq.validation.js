import Joi from "joi";

export const createFAQSchemaValidation = Joi.object({
  slug: Joi.string().lowercase().trim().optional().messages({
    "string.base": "Slug must be a string",
    "string.empty": "Slug cannot be empty",
  }),
  question: Joi.string().required().trim().messages({
    "any.required": "Question is required",
    "string.empty": "Question cannot be empty",
  }),
  answer: Joi.string().required().trim().messages({
    "any.required": "Answer is required",
    "string.empty": "Answer cannot be empty",
  }),
  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});

export const updateFAQSchema = Joi.object({
  slug: Joi.string().lowercase().trim().optional().messages({
    "string.base": "Slug must be a string",
    "string.empty": "Slug cannot be empty",
  }),
  question: Joi.string().trim().optional().messages({
    "string.empty": "Question cannot be empty",
  }),
  answer: Joi.string().trim().optional().messages({
    "string.empty": "Answer cannot be empty",
  }),
  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});