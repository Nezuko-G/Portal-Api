import Joi from "joi";

export const createFAQSchemaValidation = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    question: Joi.object({
      en: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("faq.question_required"),
          "string.empty": t("faq.question_required"),
        }),
      ar: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("faq.question_required"),
          "string.empty": t("faq.question_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("faq.question_required"),
      }),
    answer: Joi.object({
      en: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("faq.answer_required"),
          "string.empty": t("faq.answer_required"),
        }),
      ar: Joi.string()
        .required()
        .trim()
        .messages({
          "any.required": t("faq.answer_required"),
          "string.empty": t("faq.answer_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("faq.answer_required"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};

export const updateFAQSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    question: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Question must be an object",
      }),
    answer: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Answer must be an object",
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
