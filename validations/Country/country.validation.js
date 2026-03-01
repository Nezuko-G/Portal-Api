import Joi from "joi";
import { COUNTRY_NAMES, COUNTRY_CODES } from "../../utils/countries-data.js";

export const createCountrySchema = (req) => {
  const t = req.__ || req._t || ((key) => key);

  return Joi.object({
    name: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.country_name_required"),
          "string.empty": t("validation.country_name_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.country_name_required"),
          "string.empty": t("validation.country_name_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("validation.country_name_required"),
      }),

    code: Joi.string()
      .trim()
      .uppercase()
      .valid(...COUNTRY_CODES)
      .required()
      .messages({
        "any.required": t("validation.country_code_required"),
        "string.empty": t("validation.country_code_required"),
        "any.only": t("validation.country_code_invalid"),
      }),

    cities: Joi.array()
      .items(
        Joi.object({
          name: Joi.object({
            en: Joi.string()
              .trim()
              .required()
              .messages({
                "any.required": t("validation.city_name_required"),
                "string.empty": t("validation.city_name_required"),
              }),
            ar: Joi.string()
              .trim()
              .required()
              .messages({
                "any.required": t("validation.city_name_required"),
                "string.empty": t("validation.city_name_required"),
              }),
          })
            .required()
            .messages({
              "any.required": t("validation.city_name_required"),
            }),
          is_deleted: Joi.boolean().default(false),
        })
      )
      .default([])
      .messages({
        "array.base": t("validation.cities_must_be_array"),
      }),

    is_deleted: Joi.boolean().default(false).messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};

export const updateCountrySchema = (req) => {
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

    code: Joi.string()
      .trim()
      .uppercase()
      .valid(...COUNTRY_CODES)
      .optional()
      .messages({
        "string.empty": t("validation.country_code_required"),
        "any.only": t("validation.country_code_invalid"),
      }),

    cities: Joi.array()
      .items(
        Joi.object({
          name: Joi.object({
            en: Joi.string().trim().optional(),
            ar: Joi.string().trim().optional(),
          })
            .optional()
            .messages({
              "object.base": "Name must be an object",
            }),
            .required()
            .messages({
              "string.empty": t("validation.city_name_required"),
            }),
          is_deleted: Joi.boolean(),
        })
      )
      .optional()
      .messages({
        "array.base": t("validation.cities_must_be_array"),
      }),

    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),
  });
};
