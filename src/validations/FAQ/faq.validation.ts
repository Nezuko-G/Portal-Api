import Joi from "joi";
import type { Request } from "express";

type TranslationFunction = (
  key: string,
  options?: Record<string, any>,
) => string;

const localizedTextSchema = (t: TranslationFunction): Joi.ObjectSchema =>
  Joi.object({
    en: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("faq.question_required"),
        "string.empty": t("faq.question_required"),
        "string.base": t("faq.question_required"),
      }),
    ar: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("faq.question_required"),
        "string.empty": t("faq.question_required"),
        "string.base": t("faq.question_required"),
      }),
  });

export const createFAQSchemaValidation = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    slug: Joi.string().lowercase().trim().optional().messages({
      "string.base": "Slug must be a string",
      "string.empty": "Slug cannot be empty",
    }),
    question: localizedTextSchema(t)
      .required()
      .messages({
        "any.required": t("faq.question_required"),
        "object.base": t("faq.question_required"),
      }),
    answer: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("faq.answer_required"),
          "string.empty": t("faq.answer_required"),
          "string.base": t("faq.answer_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("faq.answer_required"),
          "string.empty": t("faq.answer_required"),
          "string.base": t("faq.answer_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("faq.answer_required"),
        "object.base": t("faq.answer_required"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};

export const updateFAQSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    slug: Joi.string().lowercase().trim().optional().messages({
      "string.base": "Slug must be a string",
      "string.empty": "Slug cannot be empty",
    }),
    question: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base": t("faq.question_empty"),
      }),
    answer: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base": t("faq.answer_empty"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
