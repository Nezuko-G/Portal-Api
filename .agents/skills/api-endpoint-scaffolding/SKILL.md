---
name: api-endpoint-scaffolding
description: Use this skill when creating, extending, or refactoring REST API endpoints, routes, controllers, Mongoose models, or Joi validation schemas in the Portal-Api project.
---

# API Endpoint Scaffolding Runbook

This skill provides step-by-step instructions for adding or modifying endpoints in **Portal-Api**, adhering to the layered MVC architecture, TypeScript ES module standards, input validation, localized error handling, and security boundaries.

---

## 1. Architecture & Layering Rules

Every API domain in `src/` follows a strict layered structure:

```text
src/
├── models/<Domain>/<domain>.model.ts        # Mongoose Schema & Interfaces
├── validations/<Domain>/<domain>.validation.ts # Joi Validation Schemas (Localized)
├── controllers/<Domain>/<domain>.controller.ts # Request parsing & HTTP responses
├── routers/<Domain>/<domain>.routes.ts       # Route definitions & Middleware pipeline
└── routers/index.ts                         # Main API router registry (/api prefix)
```

> [!IMPORTANT]
> - Always use ES Module syntax with `.js` extensions in import paths (e.g., `import { User } from "../../models/User/user.model.js";`).
> - Do not write raw business logic or database queries inside router files.
> - Never return unhandled errors directly to clients. Throw standard error classes or pass to `next(error)`.

---

## 2. Step-by-Step Implementation Guide

### Step 1: Define the Mongoose Model
Create or update `src/models/<Domain>/<domain>.model.ts`.

Key standards:
- Use `localizedStringField()` from `../../utils/helpers.js` for bilingual text fields (English and Arabic).
- Include `is_deleted: { type: Boolean, default: false }` for soft-deletion.
- Enable `{ timestamps: true }`.

```typescript
import mongoose, { Document, Schema } from "mongoose";
import { localizedStringField } from "../../utils/helpers.js";

export interface IExample extends Document {
  title: { en: string; ar: string };
  slug?: string;
  is_deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const exampleSchema = new Schema<IExample>(
  {
    title: {
      ...localizedStringField(),
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Example = mongoose.model<IExample>("Example", exampleSchema);
```

---

### Step 2: Define Joi Validation Schemas
Create `src/validations/<Domain>/<domain>.validation.ts`.

Key standards:
- Accept `req: Request` so validation error messages can be dynamically translated using `req.__` or `(req as any)._t`.
- Validate required sub-properties for bilingual objects (`en`, `ar`).

```typescript
import Joi from "joi";
import type { Request } from "express";

type TranslationFn = (key: string, options?: Record<string, any>) => string;

export const createExampleSchema = (req: Request): Joi.ObjectSchema => {
  const t: TranslationFn = (req as any).__ || (req as any)._t || ((k: string) => k);

  return Joi.object({
    title: Joi.object({
      en: Joi.string().trim().required().messages({
        "any.required": t("validation.title_en_required"),
        "string.empty": t("validation.title_en_required"),
      }),
      ar: Joi.string().trim().required().messages({
        "any.required": t("validation.title_ar_required"),
        "string.empty": t("validation.title_ar_required"),
      }),
    }).required(),
    slug: Joi.string().trim().lowercase().optional(),
  });
};
```

---

### Step 3: Implement the Controller
Create `src/controllers/<Domain>/<domain>.controller.ts`.

Key standards:
- Wrap async execution in `try / catch (error) { next(error); }`.
- Validate route ID parameters using `validateObjectId(req.params.id)`.
- Use custom error classes from `../../utils/error.js` (`BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`).
- Resolve locale using `resolveLocale(req)` and localize responses using `localizeData(data, locale)`.
- Bust in-memory cache on mutations (create/update/delete) with `clearLocalizedCache(cache, cacheKey)`.

```typescript
import { Request, Response, NextFunction } from "express";
import { Example } from "../../models/Example/example.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { resolveLocale, localizeData, clearLocalizedCache } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";

const CACHE_KEY = "examples";

export const getExamplesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const examples = await Example.find({ is_deleted: false }).lean();

    res.status(200).json({
      status: "success",
      results: examples.length,
      data: localizeData(examples, locale),
    });
  } catch (error) {
    next(error);
  }
};

export const createExampleController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const newDoc = await Example.create(req.body);

    clearLocalizedCache(cache, CACHE_KEY);

    res.status(201).json({
      message: (res as any)._t("example.created") || "Created successfully",
      data: localizeData(newDoc, locale),
    });
  } catch (error) {
    next(error);
  }
};
```

---

### Step 4: Configure Routes & Middleware Pipeline
Create `src/routers/<Domain>/<domain>.routes.ts`.

Key standards:
- Apply `validate(schema)` middleware before controller execution.
- Protect administrative routes with `authenticateToken` and `checkRoles(["ADMIN"])`.

```typescript
import { Router } from "express";
import {
  getExamplesController,
  createExampleController,
} from "../../controllers/Example/example.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createExampleSchema } from "../../validations/Example/example.validation.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRoles } from "../../middlewares/check_roles.middleware.js";

const router = Router();

router.get("/", getExamplesController);

router.post(
  "/",
  authenticateToken,
  checkRoles(["ADMIN"]),
  validate(createExampleSchema),
  createExampleController
);

export { router as ExampleRouter };
```

---

### Step 5: Register Router in Main Gateway
Edit `src/routers/index.ts` to mount the newly created router:

```typescript
import { ExampleRouter } from "./Example/example.routes.js";
// ...
router.use("/example", ExampleRouter);
```

---

### Step 6: Update Localization Dictionaries
Ensure all message keys used in validation and responses exist in:
- `src/locales/en.json`
- `src/locales/ar.json`

---

## 3. Verification Checklist

1. **Compilation Check**: Run `npm run build` or `npx tsc --noEmit` to verify type safety.
2. **Route Testing**: Verify using Supertest in `tests/` or make a test request to `/api/<endpoint>`.
3. **Locale Header Test**:
   - Send `Accept-Language: en` and verify English strings.
   - Send `Accept-Language: ar` and verify Arabic strings.
4. **Validation Test**: Send invalid payload and verify `400 Bad Request` with localized message.
