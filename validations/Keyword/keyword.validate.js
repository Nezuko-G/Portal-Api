import Joi from "joi";

export const createKeywordSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    word: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.keyword_en_required"),
          "string.empty": t("validation.keyword_en_required"),
          "any.required": t("validation.keyword_en_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.keyword_ar_required"),
          "string.empty": t("validation.keyword_ar_required"),
          "any.required": t("validation.keyword_ar_required"),
        }),
    })
      .required()
      .messages({
        "object.base": "Keyword must be an object with 'en' and 'ar' fields",
        "any.required": "Keyword is required",
      }),
  });
};

export const updateKeywordSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    word: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.keyword_en_required"),
          "string.empty": t("validation.keyword_en_required"),
          "any.required": t("validation.keyword_en_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "string.base": t("validation.keyword_ar_required"),
          "string.empty": t("validation.keyword_ar_required"),
          "any.required": t("validation.keyword_ar_required"),
        }),
    })
      .required()
      .messages({
        "object.base": "Keyword must be an object with 'en' and 'ar' fields",
        "any.required": "Keyword is required",
      }),
  });
};
