import Joi from "joi";

const objectId = Joi.string().hex().length(24);

const listItemSchema = Joi.object({
  text: Joi.string().trim().required().messages({
    "any.required": "Text is required",
    "string.empty": "Text cannot be empty",
    "string.base": "Text must be a string",
  }),
});

export const createJobSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "any.required": "Job title is required",
    "string.empty": "Job title cannot be empty",
  }),

  jobId: Joi.string().trim().messages({
    "string.base": "Job ID must be a string",
  }),

  company: Joi.string().trim().required().messages({
    "any.required": "Company name is required",
    "string.empty": "Company name cannot be empty",
  }),

  organization: Joi.string().trim().messages({
    "string.base": "Organization must be a string",
  }),

  description: Joi.string().required().messages({
    "any.required": "Job description is required",
    "string.empty": "Job description cannot be empty",
  }),

  fieldOfWork: objectId.required().messages({
    "any.required": "Field of work is required",
    "string.length": "Field of work must be a valid ObjectId",
  }),

  experienceLevel: objectId.required().messages({
    "any.required": "Experience level is required",
    "string.length": "Experience level must be a valid ObjectId",
  }),

  keywords: Joi.array()
    .items(
      objectId.messages({
        "string.length": "Keyword must be a valid ObjectId",
      })
    )
    .default([])
    .messages({
      "array.base": "Keywords must be an array",
    }),

  jobType: Joi.string()
    .valid("full-time", "part-time", "internship")
    .default("full-time")
    .messages({
      "any.only": "Job type must be full-time, part-time, or internship",
    }),

  employmentType: Joi.string()
    .valid("fixed-term", "permanent", "contract")
    .optional()
    .messages({
      "any.only": "Employment type must be fixed-term, permanent, or contract",
    }),

  responsibilities: Joi.array().items(listItemSchema).default([]).messages({
    "array.base": "Responsibilities must be an array",
  }),

  requirements: Joi.array().items(listItemSchema).default([]).messages({
    "array.base": "Requirements must be an array",
  }),

  country: objectId.required().messages({
    "any.required": "Country is required",
    "string.length": "Country must be a valid ObjectId",
  }),

  locationDetails: Joi.string().trim().messages({
    "string.base": "Location details must be a string",
  }),

  workMode: Joi.string()
    .valid("office", "remote", "hybrid")
    .default("office")
    .messages({
      "any.only": "Work mode must be office, remote, or hybrid",
    }),

  expirationDate: Joi.date().greater("now").required().messages({
    "any.required": "Expiration date is required",
    "date.greater": "Expiration date must be in the future",
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

export const updateJobSchema = Joi.object({
  title: Joi.string().trim().optional().messages({
    "string.base": "Job title must be a string",
    "string.empty": "Job title cannot be empty",
  }),

  jobId: Joi.string().trim().optional().messages({
    "string.base": "Job ID must be a string",
    "string.empty": "Job ID cannot be empty",
  }),

  company: Joi.string().trim().optional().messages({
    "string.base": "Company name must be a string",
    "string.empty": "Company name cannot be empty",
  }),

  organization: Joi.string().trim().optional().messages({
    "string.base": "Organization must be a string",
    "string.empty": "Organization cannot be empty",
  }),

  description: Joi.string().optional().messages({
    "string.base": "Job description must be a string",
    "string.empty": "Job description cannot be empty",
  }),

  fieldOfWork: objectId.optional().messages({
    "string.length": "Field of work must be a valid ObjectId",
    "string.hex": "Field of work must be a valid ObjectId",
  }),

  experienceLevel: objectId.optional().messages({
    "string.length": "Experience level must be a valid ObjectId",
    "string.hex": "Experience level must be a valid ObjectId",
  }),

  keywords: Joi.array()
    .items(
      objectId.messages({
        "string.length": "Each keyword must be a valid ObjectId",
        "string.hex": "Each keyword must be a valid ObjectId",
      })
    )
    .optional()
    .messages({
      "array.base": "Keywords must be an array",
    }),

  jobType: Joi.string()
    .valid("full-time", "part-time", "internship")
    .optional()
    .messages({
      "any.only": "Job type must be one of full-time, part-time, or internship",
      "string.base": "Job type must be a string",
    }),

  employmentType: Joi.string()
    .valid("fixed-term", "permanent", "contract")
    .optional()
    .messages({
      "any.only": "Employment type must be fixed-term, permanent, or contract",
      "string.base": "Employment type must be a string",
    }),

  responsibilities: Joi.array().items(listItemSchema).optional().messages({
    "array.base": "Responsibilities must be an array",
  }),

  requirements: Joi.array().items(listItemSchema).optional().messages({
    "array.base": "Requirements must be an array",
  }),

  country: objectId.optional().messages({
    "string.length": "Country must be a valid ObjectId",
    "string.hex": "Country must be a valid ObjectId",
  }),

  locationDetails: Joi.string().trim().optional().messages({
    "string.base": "Location details must be a string",
    "string.empty": "Location details cannot be empty",
  }),

  workMode: Joi.string()
    .valid("office", "remote", "hybrid")
    .optional()
    .messages({
      "any.only": "Work mode must be office, remote, or hybrid",
      "string.base": "Work mode must be a string",
    }),

  expirationDate: Joi.date().greater("now").optional().messages({
    "date.base": "Expiration date must be a valid date",
    "date.greater": "Expiration date must be in the future",
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
