import Joi from "joi";
import type { Request } from "express";
import { COUNTRY_CODES } from "../../utils/countries-data.js";

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
        "any.required": t("validation.country_name_required"),
        "string.empty": t("validation.country_name_required"),
        "string.base": t("validation.country_name_required"),
      }),
    ar: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("validation.country_name_required"),
        "string.empty": t("validation.country_name_required"),
        "string.base": t("validation.country_name_required"),
      }),
  });

export const createCountrySchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    name: localizedTextSchema(t)
      .required()
      .messages({
        "any.required": t("validation.country_name_required"),
        "object.base": t("validation.country_name_required"),
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
          name: localizedTextSchema(t)
            .required()
            .messages({
              "any.required": t("validation.city_name_required"),
              "object.base": t("validation.city_name_required"),
            }),
          is_deleted: Joi.boolean().default(false),
        }),
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

export const updateCountrySchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    name: localizedTextSchema(t)
      .optional()
      .messages({
        "object.base": t("validation.country_name_required"),
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
          name: localizedTextSchema(t)
            .required()
            .messages({
              "object.base": t("validation.city_name_required"),
            }),
          is_deleted: Joi.boolean(),
        }),
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
