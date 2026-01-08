import Joi from "joi";

export const createExperienceLevelSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    title: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.title_en_required"),
          "string.empty": t("validation.title_en_required"),
          "any.required": t("validation.title_en_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.title_ar_required"),
          "string.empty": t("validation.title_ar_required"),
          "any.required": t("validation.title_ar_required"),
        }),
    })
      .required()
      .messages({
        "object.base": "Title must be an object with 'en' and 'ar' fields",
        "any.required": "Title is required",
      }),
    minYears: Joi.number()
      .min(0)
      .required()
      .messages({
        "number.base": "minYears must be a number",
        "number.min": t("validation.min_years_negative"),
        "any.required": t("validation.min_years_required"),
      }),
    maxYears: Joi.number()
      .min(Joi.ref("minYears"))
      .optional()
      .messages({
        "number.base": "maxYears must be a number",
        "number.min": t("validation.max_years_less_than_min"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};

export const updateExperienceLevelSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    title: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.title_en_required"),
          "string.empty": t("validation.title_en_required"),
          "any.required": t("validation.title_en_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.title_ar_required"),
          "string.empty": t("validation.title_ar_required"),
          "any.required": t("validation.title_ar_required"),
        }),
    })
      .optional()
      .messages({
        "object.base": "Title must be an object with 'en' and 'ar' fields",
      }),
    minYears: Joi.number()
      .min(0)
      .optional()
      .messages({
        "number.base": "minYears must be a number",
        "number.min": t("validation.min_years_negative"),
      }),
    maxYears: Joi.number()
      .min(Joi.ref("minYears"))
      .optional()
      .messages({
        "number.base": "maxYears must be a number",
        "number.min": t("validation.max_years_less_than_min"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
