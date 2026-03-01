import Joi from "joi";
import { JOB_CATEGORIES } from "../../utils/constants.js";

export const createCategorySchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    name: Joi.object({
      en: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("category.name_required"),
          "string.empty": t("category.name_required"),
        }),
      ar: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("category.name_required"),
          "string.empty": t("category.name_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("category.name_required"),
      }),

    slug: Joi.string().trim().lowercase().optional().messages({
      "string.base": "Slug must be a string",
    }),

    description: Joi.object({
      en: Joi.string().allow("").optional(),
      ar: Joi.string().allow("").optional(),
    })
      .optional()
      .messages({
        "object.base": "Description must be an object",
      }),

    keywords: Joi.array()
      .items(
        Joi.string().trim().messages({
          "string.base": "Each keyword must be a string",
          "string.empty": "Keywords cannot contain empty strings",
        }),
      )
      .default([])
      .messages({
        "array.base": "Keywords must be an array of strings",
      }),

    is_deleted: Joi.boolean().default(false).messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};

export const updateCategorySchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    name: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Name must be an object",
      }),

    slug: Joi.string().trim().lowercase().optional().messages({
      "string.base": "Slug must be a string",
    }),

    description: Joi.object({
      en: Joi.string().allow("").optional(),
      ar: Joi.string().allow("").optional(),
    })
      .optional()
      .messages({
        "object.base": "Description must be an object",
      }),

    keywords: Joi.array()
      .items(
        Joi.string().trim().messages({
          "string.base": "Each keyword must be a string",
          "string.empty": "Keywords cannot contain empty strings",
        }),
      )
      .optional()
      .messages({
        "array.base": "Keywords must be an array",
      }),

    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
