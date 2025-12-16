import Joi from "joi";
import { COUNTRY_NAMES, COUNTRY_CODES } from "../../utils/countries-data.js";

export const createCountrySchema = Joi.object({
  name: Joi.string()
    .trim()
    .valid(...COUNTRY_NAMES)
    .required()
    .messages({
      "any.required": "Country name is required",
      "string.empty": "Country name cannot be empty",
      "any.only": "Invalid or non-existent country name",
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .valid(...COUNTRY_CODES)
    .required()
    .messages({
      "any.required": "Country code is required",
      "string.empty": "Country code cannot be empty",
      "any.only": "Invalid country code",
    }),

  cities: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          "any.required": "City name is required",
          "string.empty": "City name cannot be empty",
        }),
        is_deleted: Joi.boolean().default(false),
      })
    )
    .default([])
    .messages({
      "array.base": "Cities must be an array",
    }),

  is_deleted: Joi.boolean().default(false).messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string()
    .trim()
    .valid(...COUNTRY_NAMES)
    .optional()
    .messages({
      "string.empty": "Country name cannot be empty",
      "any.only": "Invalid or non-existent country name",
    }),

  code: Joi.string()
    .trim()
    .uppercase()
    .valid(...COUNTRY_CODES)
    .optional()
    .messages({
      "string.empty": "Country code cannot be empty",
      "any.only": "Invalid country code",
    }),

  cities: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          "string.empty": "City name cannot be empty",
        }),
        is_deleted: Joi.boolean(),
      })
    )
    .optional()
    .messages({
      "array.base": "Cities must be an array",
    }),

  is_deleted: Joi.boolean().optional().messages({
    "boolean.base": "is_deleted must be a boolean",
  }),
});
