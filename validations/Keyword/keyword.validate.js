import Joi from "joi";

export const createKeywordSchema = Joi.object({
    word: Joi.object({
        en: Joi.string().trim().required().messages({
            "string.base": "Keyword (English) must be a string",
            "string.empty": "Keyword (English) is required",
            "any.required": "Keyword (English) is required",
        }),
        ar: Joi.string().trim().required().messages({
            "string.base": "Keyword (Arabic) must be a string",
            "string.empty": "Keyword (Arabic) is required",
            "any.required": "Keyword (Arabic) is required",
        }),
    }).required().messages({
        "object.base": "Keyword must be an object with 'en' and 'ar' fields",
        "any.required": "Keyword is required",
    }),
});

export const updateKeywordSchema = Joi.object({
    word: Joi.object({
        en: Joi.string().trim().required().messages({
            "string.base": "Keyword (English) must be a string",
            "string.empty": "Keyword (English) cannot be empty",
            "any.required": "Keyword (English) is required",
        }),
        ar: Joi.string().trim().required().messages({
            "string.base": "Keyword (Arabic) must be a string",
            "string.empty": "Keyword (Arabic) cannot be empty",
            "any.required": "Keyword (Arabic) is required",
        }),
    }).required().messages({
        "object.base": "Keyword must be an object with 'en' and 'ar' fields",
        "any.required": "Keyword is required",
    }),
});