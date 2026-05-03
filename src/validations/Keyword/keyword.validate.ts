import Joi from "joi";
import type { Request } from "express";

type TranslationFunction = (
  key: string,
  options?: Record<string, any>,
) => string;

export const createKeywordSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

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

export const updateKeywordSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

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
