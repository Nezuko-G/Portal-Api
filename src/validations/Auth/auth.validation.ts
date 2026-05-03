import Joi from "joi";
import type { Request } from "express";
import { ROLES, DEFAULT_ROLE } from "../../utils/constants.js";

type TranslationFunction = (
  key: string,
  options?: Record<string, any>,
) => string;

// Signup
export const SignUpSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .trim()
      .required()
      .messages({
        "string.base": t("validation.name_required"),
        "string.empty": t("validation.name_required"),
        "string.min": t("validation.name_min"),
        "string.max": t("validation.name_max"),
        "any.required": t("validation.name_required"),
      }),

    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        "string.email": t("validation.email_invalid"),
        "string.empty": t("validation.email_required"),
        "any.required": t("validation.email_required"),
      }),

    phone: Joi.string()
      .pattern(/^01[0125][0-9]{8}$/)
      .trim()
      .required()
      .messages({
        "string.base": t("validation.phone_required"),
        "string.pattern.base": t("validation.phone_invalid"),
        "string.empty": t("validation.phone_required"),
        "any.required": t("validation.phone_required"),
      }),
    password: Joi.string()
      .min(8)
      .max(40)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      )
      .required()
      .messages({
        "string.min": t("validation.password_min"),
        "string.max": t("validation.password_max"),
        "string.pattern.base": t("validation.password_pattern"),
        "string.empty": t("validation.password_required"),
        "any.required": t("validation.password_required"),
      }),

    role: Joi.string()
      .valid(...ROLES)
      .default(DEFAULT_ROLE)
      .messages({
        "any.only": t("validation.role_invalid"),
        "string.base": t("validation.role_invalid"),
      }),
  });
};

// login
export const LoginSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        "string.empty": t("validation.email_required"),
        "string.email": t("validation.email_invalid"),
        "any.required": t("validation.email_required"),
      }),
    password: Joi.string()
      .min(8)
      .required()
      .messages({
        "string.empty": t("validation.password_required"),
        "string.min": t("validation.password_min"),
        "any.required": t("validation.password_required"),
      }),
  });
};

// Forget Password
export const ForgotPasswordSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        "string.email": t("validation.email_invalid"),
        "string.empty": t("validation.email_required"),
        "any.required": t("validation.email_required"),
      }),
  });
};

// Verify Reset Code
export const VerifyResetCodeSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        "string.email": t("validation.email_invalid"),
        "string.empty": t("validation.email_required"),
        "any.required": t("validation.email_required"),
      }),

    code: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": t("validation.code_length"),
        "string.pattern.base": t("validation.code_pattern"),
        "string.empty": t("validation.code_length"),
        "any.required": t("validation.code_length"),
      }),
  });
};

// Reset Password
export const ResetPasswordSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFunction =
    (req as any).__ || (req as any)._t || ((key: string) => key);

  return Joi.object({
    email: Joi.string()
      .email()
      .trim()
      .lowercase()
      .required()
      .messages({
        "string.email": t("validation.email_invalid"),
        "string.empty": t("validation.email_required"),
        "any.required": t("validation.email_required"),
      }),

    code: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required()
      .messages({
        "string.length": t("validation.code_length"),
        "string.pattern.base": t("validation.code_pattern"),
        "string.empty": t("validation.code_length"),
        "any.required": t("validation.code_length"),
      }),

    password: Joi.string()
      .min(8)
      .max(40)
      .pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      )
      .required()
      .messages({
        "string.min": t("validation.password_min"),
        "string.max": t("validation.password_max"),
        "string.pattern.base": t("validation.password_pattern"),
        "string.empty": t("validation.password_required"),
        "any.required": t("validation.password_required"),
      }),

    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": t("validation.passwords_mismatch"),
        "string.empty": t("validation.confirm_password_required"),
        "any.required": t("validation.confirm_password_required"),
      }),
  });
};
