import Joi from "joi";

export const createFAQSchemaValidation = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    slug: Joi.string().lowercase().trim().optional().messages({
      "string.base": "Slug must be a string",
      "string.empty": "Slug cannot be empty",
    }),
    question: Joi.string()
      .required()
      .trim()
      .messages({
        "any.required": t("faq.question_required"),
        "string.empty": t("faq.question_required"),
      }),
    answer: Joi.string()
      .required()
      .trim()
      .messages({
        "any.required": t("faq.answer_required"),
        "string.empty": t("faq.answer_required"),
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
    question: Joi.string()
      .trim()
      .optional()
      .messages({
        "string.empty": t("faq.question_empty"),
      }),
    answer: Joi.string()
      .trim()
      .optional()
      .messages({
        "string.empty": t("faq.answer_empty"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
