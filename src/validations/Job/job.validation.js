import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const localizedTextSchema = (t, requiredMessages) =>
  Joi.object({
    en: Joi.string().trim().required().messages({
      "any.required": requiredMessages.en,
      "string.empty": requiredMessages.en,
      "string.base": requiredMessages.en,
    }),
    ar: Joi.string().trim().required().messages({
      "any.required": requiredMessages.ar,
      "string.empty": requiredMessages.ar,
      "string.base": requiredMessages.ar,
    }),
  });

const listItemSchemaFactory = (t) =>
  Joi.object({
    text: localizedTextSchema(t, {
      en: t("validation.text_required"),
      ar: t("validation.text_required"),
    })
      .required()
      .messages({
        "any.required": t("validation.text_required"),
        "object.base": t("validation.text_required"),
      }),
  });

export const createJobSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);
  const listItemSchema = listItemSchemaFactory(t);

  return Joi.object({
    title: localizedTextSchema(t, {
      en: t("validation.title_en_required"),
      ar: t("validation.title_ar_required"),
    })
      .required()
      .messages({
        "any.required": t("validation.job_title_required"),
        "object.base": t("validation.job_title_required"),
      }),

    jobId: Joi.string().trim().messages({
      "string.base": "Job ID must be a string",
    }),

    company: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("validation.company_required"),
        "string.empty": t("validation.company_required"),
      }),

    organization: Joi.string().trim().messages({
      "string.base": "Organization must be a string",
    }),

    description: localizedTextSchema(t, {
      en: t("validation.job_description_required"),
      ar: t("validation.job_description_required"),
    })
      .required()
      .messages({
        "any.required": t("validation.job_description_required"),
        "object.base": t("validation.job_description_required"),
      }),

    fieldOfWork: objectId.required().messages({
      "any.required": t("validation.field_of_work_required"),
      "string.length": t("validation.invalid_object_id"),
    }),

    experienceLevel: objectId.required().messages({
      "any.required": t("validation.experience_level_required"),
      "string.length": t("validation.invalid_object_id"),
    }),

    keywords: Joi.array()
      .items(
        objectId.messages({
          "string.length": t("validation.invalid_object_id"),
        }),
      )
      .default([])
      .messages({
        "array.base": "Keywords must be an array",
      }),

    jobType: Joi.string()
      .valid("full-time", "part-time", "internship")
      .default("full-time")
      .messages({
        "any.only": t("validation.job_type_invalid"),
      }),

    employmentType: Joi.string()
      .valid("fixed-term", "permanent", "contract")
      .optional()
      .messages({
        "any.only": t("validation.employment_type_invalid"),
      }),

    responsibilities: Joi.array().items(listItemSchema).default([]).messages({
      "array.base": "Responsibilities must be an array",
    }),

    requirements: Joi.array().items(listItemSchema).default([]).messages({
      "array.base": "Requirements must be an array",
    }),

    country: objectId.required().messages({
      "any.required": t("validation.country_required"),
      "string.length": t("validation.invalid_object_id"),
    }),

    locationDetails: localizedTextSchema(t, {
      en: "Location details must be provided in English",
      ar: "Location details must be provided in Arabic",
    })
      .optional()
      .messages({
        "object.base":
          "Location details must be an object with 'en' and 'ar' fields",
      }),

    workMode: Joi.string()
      .valid("office", "remote", "hybrid")
      .default("office")
      .messages({
        "any.only": t("validation.work_mode_invalid"),
      }),

    expirationDate: Joi.date()
      .greater("now")
      .required()
      .messages({
        "any.required": t("validation.expiration_date_required"),
        "date.greater": t("validation.expiration_date_future"),
      }),

    duration: localizedTextSchema(t, {
      en: "Duration must be provided in English",
      ar: "Duration must be provided in Arabic",
    })
      .optional()
      .messages({
        "object.base": "Duration must be an object with 'en' and 'ar' fields",
      }),

    is_deleted: Joi.boolean().default(false).messages({
      "boolean.base": "is_deleted must be a boolean",
    }),

    is_active: Joi.boolean().default(true).messages({
      "boolean.base": "is_active must be a boolean",
    }),
  });
};

export const updateJobSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);
  const listItemSchema = listItemSchemaFactory(t);

  return Joi.object({
    title: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base": t("validation.job_title_required"),
      }),

    jobId: Joi.string().trim().optional().messages({
      "string.base": "Job ID must be a string",
      "string.empty": "Job ID cannot be empty",
    }),

    company: Joi.string()
      .trim()
      .optional()
      .messages({
        "string.base": "Company name must be a string",
        "string.empty": t("validation.company_required"),
      }),

    organization: Joi.string().trim().optional().messages({
      "string.base": "Organization must be a string",
      "string.empty": "Organization cannot be empty",
    }),

    description: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base": t("validation.job_description_required"),
      }),

    fieldOfWork: objectId.optional().messages({
      "string.length": t("validation.invalid_object_id"),
      "string.hex": t("validation.invalid_object_id"),
    }),

    experienceLevel: objectId.optional().messages({
      "string.length": t("validation.invalid_object_id"),
      "string.hex": t("validation.invalid_object_id"),
    }),

    keywords: Joi.array()
      .items(
        objectId.messages({
          "string.length": t("validation.invalid_object_id"),
          "string.hex": t("validation.invalid_object_id"),
        }),
      )
      .optional()
      .messages({
        "array.base": "Keywords must be an array",
      }),

    jobType: Joi.string()
      .valid("full-time", "part-time", "internship")
      .optional()
      .messages({
        "any.only": t("validation.job_type_invalid"),
        "string.base": "Job type must be a string",
      }),

    employmentType: Joi.string()
      .valid("fixed-term", "permanent", "contract")
      .optional()
      .messages({
        "any.only": t("validation.employment_type_invalid"),
        "string.base": "Employment type must be a string",
      }),

    responsibilities: Joi.array().items(listItemSchema).optional().messages({
      "array.base": "Responsibilities must be an array",
    }),

    requirements: Joi.array().items(listItemSchema).optional().messages({
      "array.base": "Requirements must be an array",
    }),

    country: objectId.optional().messages({
      "string.length": t("validation.invalid_object_id"),
      "string.hex": t("validation.invalid_object_id"),
    }),

    locationDetails: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base":
          "Location details must be an object with 'en' and 'ar' fields",
      }),

    workMode: Joi.string()
      .valid("office", "remote", "hybrid")
      .optional()
      .messages({
        "any.only": t("validation.work_mode_invalid"),
        "string.base": "Work mode must be a string",
      }),

    expirationDate: Joi.date()
      .greater("now")
      .optional()
      .messages({
        "date.base": "Expiration date must be a valid date",
        "date.greater": t("validation.expiration_date_future"),
      }),

    duration: Joi.object({
      en: Joi.string().trim().required(),
      ar: Joi.string().trim().required(),
    })
      .optional()
      .messages({
        "object.base": "Duration must be an object with 'en' and 'ar' fields",
      }),

    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),

    is_active: Joi.boolean().optional().messages({
      "boolean.base": "is_active must be a boolean",
    }),
  });
};
