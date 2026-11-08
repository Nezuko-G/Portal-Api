---
name: api-testing-seeding
description: Use this skill when writing or executing automated tests (Jest, Supertest), testing localized API behavior, creating or running database seeders, or verifying API functionality in Portal-Api.
---

# API Testing & Database Seeding Runbook

This skill guides agents on writing and running automated test suites, testing multilingual endpoints, and managing database seeders in **Portal-Api**.

---

## 1. Testing Framework & Commands

- **Test Runner**: Jest (configured for native ES Modules with `--experimental-vm-modules`).
- **HTTP Assertion**: Supertest for end-to-end route testing.
- **Directory**: `src/tests/`

### Running Tests
Execute the complete test suite:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

Run a specific test file:
```bash
node --experimental-vm-modules ./node_modules/jest/bin/jest.js src/tests/localization.helpers.test.js
```

---

## 2. Writing Integration Tests with Supertest

When writing integration tests:
1. Import `app` directly from `../app.js` (this avoids opening port listeners).
2. Test both English (`Accept-Language: en`) and Arabic (`Accept-Language: ar`) headers.
3. Test success status codes and error boundary status codes (400, 401, 403, 404).

### Integration Test Example
```javascript
import request from "supertest";
import app from "../app.js";

describe("Category API Integration Tests", () => {
  it("should return localized data in English when Accept-Language is en", async () => {
    const response = await request(app)
      .get("/api/category")
      .set("Accept-Language", "en");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
    if (response.body.data.length > 0) {
      expect(typeof response.body.data[0].name).toBe("string");
    }
  });

  it("should return localized data in Arabic when Accept-Language is ar", async () => {
    const response = await request(app)
      .get("/api/category")
      .set("Accept-Language", "ar");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("data");
  });

  it("should reject requests with invalid ObjectIds with 400", async () => {
    const response = await request(app)
      .get("/api/category/invalid-object-id")
      .set("Accept-Language", "en");

    expect(response.status).toBe(400);
  });
});
```

---

## 3. Writing Unit Tests for Joi Validations & Helpers

Unit tests should test edge cases and error messages without spinning up Express:

```javascript
import { slugify, resolveLocale } from "../utils/helpers.js";

describe("Helper Functions Unit Tests", () => {
  test("slugify properly converts text to url-friendly slugs", () => {
    expect(slugify("Software Engineer (Senior)")).toBe("software-engineer-senior");
    expect(slugify("  Node.js & TypeScript  ")).toBe("nodejs-typescript");
  });

  test("resolveLocale correctly identifies arabic and english locales", () => {
    expect(resolveLocale("ar-EG")).toBe("ar");
    expect(resolveLocale("ar")).toBe("ar");
    expect(resolveLocale("en-US")).toBe("en");
    expect(resolveLocale("fr")).toBe("en"); // Defaults to en
  });
});
```

---

## 4. Database Seeders Architecture

Seeders populate the database with initial standard data, categories, countries, and sample vacancies. They are located in `src/seeders/`:

| Seeder Script | Command | Purpose |
|:---|:---|:---|
| `categorySeeder.ts` | `npm run seed:category` | Seeds standard job categories with bilingual names |
| `countrySeeder.ts` | `npm run seed:country` | Seeds supported countries, cities, and country codes |
| `experienceLevelSeeder.ts` | `npm run seed:experience` | Seeds experience bands (Junior, Mid, Senior, etc.) |
| `keywordSeeder.ts` | `npm run seed:keyword` | Seeds popular recruitment tags and skills |
| `faqSeeder.ts` | `npm run seed:faq` | Seeds frequent questions and bilingual answers |
| `jobSeeder.ts` | `npm run seed:job` | Seeds sample job listings associated with categories |
| **All Seeders** | `npm run seed:all` | Sequentially runs all 6 seeders above |

### Creating or Updating a Seeder
1. Always check for existing records using unique identifiers (e.g., `slug` or `name.en`) before inserting to prevent duplicate entries on repeated runs.
2. Provide both `en` and `ar` representations for all textual fields.
3. Establish database connection using `dbconnect()` from `../config/dbConnect.js` and close the connection using `mongoose.disconnect()` in a `finally` block.

```typescript
import mongoose from "mongoose";
import dbconnect from "../config/dbConnect.js";
import { Category } from "../models/Category/category.model.js";

const sampleCategories = [
  {
    name: { en: "Engineering", ar: "هندسة" },
    slug: "engineering",
    description: { en: "Engineering roles", ar: "وظائف الهندسة" },
  },
];

async function seed() {
  try {
    await dbconnect();
    for (const item of sampleCategories) {
      await Category.findOneAndUpdate(
        { slug: item.slug },
        { $set: item },
        { upsert: true, new: true }
      );
    }
    console.log("Seeding completed successfully.");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
```
