import Joi from "joi";

export const createContactUsSchemaValidation = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    name: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        "string.base": t("validation.name_required"),
        "string.empty": t("validation.name_required"),
        "string.min": t("validation.name_min", { min: 3 }),
        "string.max": t("validation.name_max", { max: 100 }),
        "any.required": t("validation.name_required"),
      }),
    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.base": t("validation.email_required"),
        "string.empty": t("validation.email_required"),
        "string.email": t("validation.email_invalid"),
        "any.required": t("validation.email_required"),
      }),
    message: Joi.string()
      .min(10)
      .max(1000)
      .required()
      .messages({
        "string.base": t("validation.message_required"),
        "string.empty": t("validation.message_required"),
        "string.min": t("validation.message_min", { min: 10 }),
        "string.max": t("validation.message_max", { max: 1000 }),
        "any.required": t("validation.message_required"),
      }),
    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
