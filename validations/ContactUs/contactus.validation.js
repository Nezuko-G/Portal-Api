import Joi from "joi";

export const createContactUsSchemaValidation = Joi.object({
  name: Joi.string().min(3).max(100).required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 3 characters",
    "string.max": "Name must be at most 100 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email address",
    "any.required": "Email is required",
  }),
  message: Joi.string().min(10).max(1000).required().messages({
    "string.base": "Message must be a string",
    "string.empty": "Message is required",
    "string.min": "Message must be at least 10 characters",
    "string.max": "Message must be at most 1000 characters",
    "any.required": "Message is required",
  }),
  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});