import Joi from "joi";

const localizedTextSchema = (t) =>
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

export const createFAQSchemaValidation = (req) => {
  const t = req.__ || req._t || ((key) => key);

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

export const updateFAQSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

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
