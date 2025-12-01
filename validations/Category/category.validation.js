import Joi from "joi";
import { JOB_CATEGORIES } from "../../utils/constants.js";

export const createCategorySchema = Joi.object({
  name: Joi.string()
    .valid(...JOB_CATEGORIES)
    .required()
    .trim()
    .messages({
      "any.required": "Category name is required",
      "string.empty": "Category name cannot be empty",
      "any.only": "Category must be one of JOB_CATEGORIES",
    }),

  slug: Joi.string().trim().lowercase().optional().messages({
    "string.base": "Slug must be a string",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),

  keywords: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Each keyword must be a string",
        "string.empty": "Keywords cannot contain empty strings",
      })
    )
    .default([])
    .messages({
      "array.base": "Keywords must be an array of strings",
    }),

  is_deleted: Joi.boolean().default(false).messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string()
    .valid(...JOB_CATEGORIES)
    .trim()
    .optional()
    .messages({
      "string.empty": "Category name cannot be empty",
      "any.only": "Category must be one of JOB_CATEGORIES",
    }),

  slug: Joi.string().trim().lowercase().optional().messages({
    "string.base": "Slug must be a string",
  }),

  description: Joi.string().allow("").optional().messages({
    "string.base": "Description must be a string",
  }),

  keywords: Joi.array()
    .items(
      Joi.string().trim().messages({
        "string.base": "Each keyword must be a string",
        "string.empty": "Keywords cannot contain empty strings",
      })
    )
    .optional()
    .messages({
      "array.base": "Keywords must be an array",
    }),

  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});
