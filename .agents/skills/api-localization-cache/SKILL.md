---
name: api-localization-cache
description: Use this skill when managing bi-directional English/Arabic internationalization (i18n), translation catalogs, or in-memory cache strategies with node-cache in Portal-Api.
---

# API Localization & Caching Runbook

This skill instructs agents on how to maintain the bi-directional (English / Arabic) localization system and the high-performance in-memory caching layer in **Portal-Api**.

---

## 1. Localization Architecture (i18n)

Portal-Api supports full bilingual operations (`en` for English, `ar` for Arabic). Localization applies to:
1. **Database documents** (storing `{ en: string, ar: string }`).
2. **Response payloads** (flattening localized objects to the requested locale).
3. **API response and error messages** (translated via JSON dictionary catalogs).

### Key Files
- `src/config/i18n.ts`: i18n configuration and middleware setup.
- `src/locales/en.json`: English translation strings.
- `src/locales/ar.json`: Arabic translation strings.
- `src/utils/helpers.ts`: Locale helpers (`resolveLocale`, `normalizeLocale`, `localizeData`, `localizedStringField`).

---

## 2. Localization Patterns & Procedures

### How to Resolve the Client Locale
Use `resolveLocale(req)` from `src/utils/helpers.js`. It checks in order:
1. `req.getLocale()`
2. Query parameter: `?lang=ar` or `?lang=en`
3. Request header: `Accept-Language: ar` or `Accept-Language: en`
4. Default fallback: `"en"`

```typescript
import { resolveLocale } from "../../utils/helpers.js";

const locale = resolveLocale(req); // returns "en" or "ar"
```

### Translating Messages in Controllers and Validations
Use `(res as any)._t("path.to.key", options)` or `req.__("path.to.key")`:

```typescript
// Controller response
res.status(200).json({
  message: (res as any)._t("job.applied_successfully"),
  data: localizedResult,
});
```

Always add corresponding keys to both `src/locales/en.json` and `src/locales/ar.json`:

```json
// en.json
{
  "job": {
    "applied_successfully": "Your application has been submitted successfully."
  }
}

// ar.json
{
  "job": {
    "applied_successfully": "تم تقديم طلب التوظيف بنجاح."
  }
}
```

### Localizing Response Payloads
Before returning database entities to the client, transform any `{ en: "...", ar: "..." }` fields into a single string matching the active locale using `localizeData(data, locale)`:

```typescript
import { localizeData, resolveLocale } from "../../utils/helpers.js";

const locale = resolveLocale(req);
const job = await Job.findById(id).lean();

res.status(200).json({
  status: "success",
  data: localizeData(job, locale),
});
```

---

## 3. In-Memory Caching Architecture (`node-cache`)

Portal-Api uses `node-cache` for frequently read, infrequently updated entities (Categories, Countries, Experience Levels, FAQs, Keywords).

### Cache Configuration
The cache is instantiated in `src/config/cache.ts` with standard TTL settings.

### Cache Key Conventions
Because cached data may be requested in either English or Arabic, cache keys **must be localized**:
- Use `buildLocalizedCacheKey(baseKey, locale)` from `src/utils/helpers.js`.
- Example format: `categories:en` and `categories:ar`.

### Read-Through Caching Pattern in Controllers
```typescript
import { cache } from "../../config/cache.js";
import {
  buildLocalizedCacheKey,
  clearLocalizedCache,
  resolveLocale,
  localizeData,
} from "../../utils/helpers.js";

const CACHE_KEY = "categories";

export const getCategoriesController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const locale = resolveLocale(req);
    const key = buildLocalizedCacheKey(CACHE_KEY, locale);

    // 1. Check cache first
    const cachedData = cache.get(key);
    if (cachedData) {
      return res.status(200).json({
        status: "success",
        source: "cache",
        data: cachedData,
      });
    }

    // 2. Fetch from database if cache miss
    const categories = await Category.find({ is_deleted: false }).lean();
    const localizedResult = localizeData(categories, locale);

    // 3. Store in cache
    cache.set(key, localizedResult);

    res.status(200).json({
      status: "success",
      source: "database",
      data: localizedResult,
    });
  } catch (error) {
    next(error);
  }
};
```

### Cache Invalidation on Mutations
Whenever an entity is created, updated, or soft-deleted, **always purge all localized variants** of the cache using `clearLocalizedCache`:

```typescript
export const updateCategoryController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ... update entity in database ...

    // Purge both :en and :ar cached variants
    clearLocalizedCache(cache, CACHE_KEY);

    res.status(200).json({
      message: (res as any)._t("category.updated"),
    });
  } catch (error) {
    next(error);
  }
};
```

---

## 4. Common Pitfalls to Avoid

1. **Forgetting to invalidate cache**: Never mutate an entity without calling `clearLocalizedCache(cache, baseKey)`.
2. **Missing Arabic translation**: Adding a key to `en.json` without adding the equivalent key to `ar.json` breaks fallback behavior.
3. **Returning raw bilingual objects**: Direct responses without `localizeData(...)` expose raw JSON schema structures `{ en: ..., ar: ... }` to clients that expect clean text.
