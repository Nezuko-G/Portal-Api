---
name: api-unified-response
description: Use this skill when structuring, sending, or refactoring API responses (both success and error envelopes) using the unified ApiResponse class in Portal-Api.
---

# API Unified Response & Envelope Runbook

This skill outlines the standard conventions and usage patterns for formatting and delivering HTTP responses in **Portal-Api**. It establishes a single, uniform contract for all client-facing payloads across success, error, pagination, and localized caching scenarios.

---

## 1. Unified Response Envelope Standard

Every HTTP response produced by **Portal-Api** conforms to the `IApiResponsePayload` envelope structure:

### Success Payload Shape
```json
{
  "success": true,
  "status": 200,
  "statusCode": 200,
  "message": "Category created successfully",
  "timestamp": "2026-11-09T18:30:00.000Z",
  "data": {
    "id": "664c123...",
    "name": "Engineering",
    "slug": "engineering"
  },
  "total": 1,
  "meta": {
    "page": 1,
    "limit": 10
  }
}
```

### Error Payload Shape
```json
{
  "success": false,
  "status": 400,
  "statusCode": 400,
  "message": "Validation failed",
  "timestamp": "2026-11-09T18:30:00.000Z",
  "errors": [
    "Field 'name.en' is required"
  ],
  "conflicts": {
    "slug": "engineering already exists"
  }
}
```

> [!NOTE]
> `status` mirrors `statusCode` to maintain full backward compatibility with legacy consumers and client libraries expecting `res.data.status`.

---

## 2. The `ApiResponse` Class

The class resides in `src/utils/response.ts` and exports static helpers and fluent instantiation:

```typescript
import { ApiResponse } from "../../utils/response.js";
```

### Core Methods Summary

| Method | HTTP Status | Typical Use Case |
|:---|:---:|:---|
| `ApiResponse.success(res, message, data?, statusCode?, meta?)` | 200 / custom | Standard retrieval, updates, action confirmations |
| `ApiResponse.created(res, message, data?, meta?)` | 201 | Resource creation (POST endpoints) |
| `ApiResponse.paginated(res, message, data, total, meta?, statusCode?)` | 200 | Lists, search results, collections with pagination |
| `ApiResponse.badRequest(res, message?, errors?, conflicts?)` | 400 | Validation issues, malformed payloads |
| `ApiResponse.unauthorized(res, message?)` | 401 | Missing or invalid auth token / session |
| `ApiResponse.forbidden(res, message?)` | 403 | RBAC role mismatch or insufficient permissions |
| `ApiResponse.notFound(res, message?)` | 404 | Resource with requested ID / slug not found |
| `ApiResponse.conflict(res, message?, conflicts?)` | 409 | Duplicate unique keys or business conflict |
| `ApiResponse.internal(res, message?, errors?)` | 500 | Unhandled exceptions or server crashes |
| `ApiResponse.error(res, message, statusCode?, errors?, conflicts?)` | Dynamic | Generic parameterized error response |

---

## 3. Usage Patterns & Best Practices

### Pattern 1: Controller Success Response (200 OK)
```typescript
import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../../utils/response.js";
import { localizeData, resolveLocale } from "../../utils/helpers.js";

export const getSingleCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const category = await Category.findById(req.params.id);

    if (!category) {
      throw new NotFoundError((res as any)._t("category.not_found"));
    }

    ApiResponse.success(
      res,
      (res as any)._t("category.fetched"),
      localizeData(category, locale)
    );
  } catch (error) {
    next(error);
  }
};
```

### Pattern 2: Resource Creation (201 Created)
```typescript
export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const newCategory = new Category(req.body);
    await newCategory.save();

    ApiResponse.created(
      res,
      (res as any)._t("category.created"),
      localizeData(newCategory, locale)
    );
  } catch (error) {
    next(error);
  }
};
```

### Pattern 3: Paginated / Collection Response
```typescript
export const getPaginatedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 10;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find({ is_deleted: false }).skip(skip).limit(limit),
      Job.countDocuments({ is_deleted: false }),
    ]);

    ApiResponse.paginated(
      res,
      (res as any)._t("job.fetched_all"),
      jobs,
      total,
      { page, limit, totalPages: Math.ceil(total / limit) }
    );
  } catch (error) {
    next(error);
  }
};
```

### Pattern 4: Localized In-Memory Caching with `toJSON()`
When caching response payloads in `node-cache`, call `.toJSON()` to generate the pure plain JSON payload:

```typescript
const localizedCacheKey = buildLocalizedCacheKey("categories", locale);
const cached = cache.get(localizedCacheKey);

if (cached) {
  res.json(cached);
  return;
}

const categories = await Category.find({ is_deleted: false });
const localized = localizeData(categories, locale);

const payload = new ApiResponse({
  message: (res as any)._t("category.fetched_all"),
  data: localized,
  total: localized.length,
}).toJSON();

cache.set(localizedCacheKey, payload);
res.json(payload);
```

### Pattern 5: Global Error Handler Integration
Errors thrown via custom classes (`BadRequestError`, `NotFoundError`, etc.) or forwarded via `next(err)` are automatically formatted by `src/middlewares/global_error_handler.middleware.ts`:

```typescript
import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/response.js";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  ApiResponse.error(res, message, statusCode, err.data, err.conflicts);
};

export default globalErrorHandler;
```

---

## 4. Dos and Don'ts

| Do | Don't |
|:---|:---|
| Use `ApiResponse.success` or `ApiResponse.created` in controllers. | Send raw inconsistent object shapes like `res.json({ message, result })`. |
| Pass localized text via `(res as any)._t(...)` into `message`. | Hardcode English or Arabic strings directly in responses. |
| Use `ApiResponse.paginated` for collections with page metadata. | Dump raw arrays directly as `res.json(items)` without envelope. |
| Clean unneeded internal fields (e.g., `password`, `__v`) before passing to `data`. | Expose sensitive password hashes or security credentials in `data`. |
| Let `globalErrorHandler` handle errors using standard error classes. | Manually send error JSON in `catch` blocks instead of calling `next(error)`. |
