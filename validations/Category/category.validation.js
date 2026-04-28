import Joi from "joi";

const localizedTextSchema = (t) =>
  Joi.object({
    en: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("validation.title_en_required"),
        "string.empty": t("validation.title_en_required"),
        "string.base": t("validation.title_en_required"),
      }),
    ar: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("validation.title_ar_required"),
        "string.empty": t("validation.title_ar_required"),
        "string.base": t("validation.title_ar_required"),
      }),
  });

export const createCategorySchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    name: localizedTextSchema(t)
      .required()
      .messages({
        "any.required": t("category.name_required"),
        "object.base": t("category.name_required"),
      }),

    slug: Joi.string().trim().lowercase().optional().messages({
      "string.base": "Slug must be a string",
    }),

    description: Joi.object({
      en: Joi.string().trim().allow("").required(),
      ar: Joi.string().trim().allow("").required(),
    })
      .optional()
      .messages({
        "object.base":
          "Description must be an object with 'en' and 'ar' fields",
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
    name: localizedTextSchema(t)
      .optional()
      .messages({
        "object.base": t("category.name_required"),
      }),

    slug: Joi.string().trim().lowercase().optional().messages({
      "string.base": "Slug must be a string",
    }),

    description: Joi.object({
      en: Joi.string().trim().allow("").required(),
      ar: Joi.string().trim().allow("").required(),
    })
      .optional()
      .messages({
        "object.base":
          "Description must be an object with 'en' and 'ar' fields",
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
