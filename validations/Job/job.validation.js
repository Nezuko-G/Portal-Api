import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const listItemSchemaFactory = (t) =>
  Joi.object({
    text: Joi.string()
      .trim()
      .required()
      .messages({
        "any.required": t("validation.text_required"),
        "string.empty": t("validation.text_required"),
        "string.base": t("validation.text_required"),
      }),
  });

export const createJobSchema = (req) => {
  const t = req.__ || req._t || ((key) => key);
  const listItemSchema = listItemSchemaFactory(t);

  return Joi.object({
    title: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.job_title_required"),
          "string.empty": t("validation.job_title_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.job_title_required"),
          "string.empty": t("validation.job_title_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("validation.job_title_required"),
      }),

    jobId: Joi.string().trim().messages({
      "string.base": "Job ID must be a string",
    }),

    company: Joi.object({
      en: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.company_required"),
          "string.empty": t("validation.company_required"),
        }),
      ar: Joi.string()
        .trim()
        .required()
        .messages({
          "any.required": t("validation.company_required"),
          "string.empty": t("validation.company_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("validation.company_required"),
      }),

    organization: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Organization must be an object",
      }),

    description: Joi.object({
      en: Joi.string()
        .required()
        .messages({
          "any.required": t("validation.job_description_required"),
          "string.empty": t("validation.job_description_required"),
        }),
      ar: Joi.string()
        .required()
        .messages({
          "any.required": t("validation.job_description_required"),
          "string.empty": t("validation.job_description_required"),
        }),
    })
      .required()
      .messages({
        "any.required": t("validation.job_description_required"),
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

    responsibilities: Joi.object({
      en: Joi.array().items(listItemSchema).default([]),
      ar: Joi.array().items(listItemSchema).default([]),
    })
      .optional()
      .messages({
        "object.base": "Responsibilities must be an object",
      }),

    requirements: Joi.object({
      en: Joi.array().items(listItemSchema).default([]),
      ar: Joi.array().items(listItemSchema).default([]),
    })
      .optional()
      .messages({
        "object.base": "Requirements must be an object",
      }),

    country: objectId.required().messages({
      "any.required": t("validation.country_required"),
      "string.length": t("validation.invalid_object_id"),
    }),

    locationDetails: Joi.string().trim().messages({
      "string.base": "Location details must be a string",
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

    duration: Joi.string().messages({
      "string.base": "Duration must be a string",
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
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Title must be an object",
      }),

    jobId: Joi.string().trim().optional().messages({
      "string.base": "Job ID must be a string",
      "string.empty": "Job ID cannot be empty",
    }),

    company: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Company must be an object",
      }),

    organization: Joi.object({
      en: Joi.string().trim().optional(),
      ar: Joi.string().trim().optional(),
    })
      .optional()
      .messages({
        "object.base": "Organization must be an object",
      }),

    description: Joi.object({
      en: Joi.string().optional(),
      ar: Joi.string().optional(),
    })
      .optional()
      .messages({
        "object.base": "Description must be an object",
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

    responsibilities: Joi.object({
      en: Joi.array().items(listItemSchema).optional(),
      ar: Joi.array().items(listItemSchema).optional(),
    })
      .optional()
      .messages({
        "object.base": "Responsibilities must be an object",
      }),

    requirements: Joi.object({
      en: Joi.array().items(listItemSchema).optional(),
      ar: Joi.array().items(listItemSchema).optional(),
    })
      .optional()
      .messages({
        "object.base": "Requirements must be an object",
      }),

    country: objectId.optional().messages({
      "string.length": t("validation.invalid_object_id"),
      "string.hex": t("validation.invalid_object_id"),
    }),

    locationDetails: Joi.string().trim().optional().messages({
      "string.base": "Location details must be a string",
      "string.empty": "Location details cannot be empty",
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

    duration: Joi.string().optional().messages({
      "string.base": "Duration must be a string",
      "string.empty": "Duration cannot be empty",
    }),

    is_deleted: Joi.boolean().optional().messages({
      "boolean.base": "is_deleted must be a boolean",
    }),

    is_active: Joi.boolean().optional().messages({
      "boolean.base": "is_active must be a boolean",
    }),
  });
};
