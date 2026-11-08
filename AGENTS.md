# Portal-Api Agent Guidelines & Skills Index

Welcome to **Portal-Api**, the backend RESTful engine for the Nezuko talent acquisition and human resource management ecosystem.

This document serves as the primary guidance file for AI agents working within this repository. It outlines project conventions, architecture, security policies, and the specialized skills available to agents.

---

## 1. Tech Stack & Environment

- **Runtime & Language**: Node.js (v18+) with TypeScript (`tsx` for dev execution, `tsc` for production builds).
- **Module System**: ES Modules (`"type": "module"` in `package.json`).
- **Web Framework**: Express 5.
- **Database & ODM**: MongoDB with Mongoose.
- **Validation**: Joi (localized schemas).
- **Authentication**: JWT, signed cookies, and Passport (Google/GitHub OAuth 2.0).
- **Internationalization**: `i18n` with bi-directional English (`en`) & Arabic (`ar`) support.
- **Caching**: `node-cache` (in-memory localized cache).
- **Testing**: Jest (`--experimental-vm-modules`) & Supertest.

---

## 2. Core Conventions & Non-Negotiable Rules

1. **ES Module Imports**: All local TypeScript imports must include `.js` extension (e.g., `import app from "./app.js";`).
2. **Layered Separation**:
   - `routers/`: Routing table, middleware chaining (`validate`, `authenticateToken`, `checkRoles`). No database logic.
   - `controllers/`: HTTP parsing, status codes, calling services/models, invoking `(res as any)._t(...)` and `localizeData(...)`.
   - `validations/`: Dynamic localized Joi schemas receiving `req`.
   - `models/`: Mongoose schemas with bilingual fields (`localizedStringField()`), `is_deleted: false`, and `timestamps: true`.
   - `services/`: Reusable business logic (JWT, password hashing, 3rd party APIs).
3. **Defensive Error Handling**: Always catch errors and forward to `next(error)` or throw custom errors (`BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError` from `src/utils/error.ts`). Never allow unhandled promise rejections.
4. **Id Sanitization**: Always validate `req.params.id` using `validateObjectId()` before querying MongoDB.
5. **Localization Integrity**: Any new user-facing text, error message, or validation alert must be added to both `src/locales/en.json` and `src/locales/ar.json`.
6. **Stateless File Uploads**: File uploads must use Multer memory storage and stream buffers to Cloudinary via `streamifier`. Never write uploaded files to local server disk.

---

## 3. Project Agent Skills Index

Specialized runbooks and cheatsheets for tasks in this repository are located under `.agents/skills/`:

| Skill Name | Path | When to Use |
|:---|:---|:---|
| **`api-endpoint-scaffolding`** | [.agents/skills/api-endpoint-scaffolding/SKILL.md](./.agents/skills/api-endpoint-scaffolding/SKILL.md) | Implementing or refactoring endpoints, routes, controllers, Mongoose models, or Joi validation schemas. |
| **`api-localization-cache`** | [.agents/skills/api-localization-cache/SKILL.md](./.agents/skills/api-localization-cache/SKILL.md) | Managing bilingual English/Arabic messages, response localization (`localizeData`), and in-memory cache invalidation (`node-cache`). |
| **`api-auth-security`** | [.agents/skills/api-auth-security/SKILL.md](./.agents/skills/api-auth-security/SKILL.md) | Handling authentication (JWT, cookies, OAuth), RBAC (`checkRoles`), password hashing, rate limiting, and secure file uploads. |
| **`api-testing-seeding`** | [.agents/skills/api-testing-seeding/SKILL.md](./.agents/skills/api-testing-seeding/SKILL.md) | Writing and running unit/integration tests with Jest & Supertest, or creating and executing database seeders. |

---

## 4. Essential Commands

```bash
# Start development server with hot-reload
npm run dev

# Compile TypeScript
npm run build

# Run automated tests
npm test

# Run database seeders (individual or all)
npm run seed:category
npm run seed:country
npm run seed:experience
npm run seed:keyword
npm run seed:faq
npm run seed:job
npm run seed:all
```
