import { jest, describe, expect, it } from "@jest/globals";
import {
  buildLocalizedCacheKey,
  clearLocalizedCache,
  localizeData,
  resolveLocale,
} from "../utils/helpers.js";

describe("localization helpers", () => {
  it("resolves supported locales", () => {
    expect(resolveLocale("ar")).toBe("ar");
    expect(resolveLocale("ar-EG")).toBe("ar");
    expect(resolveLocale("en-US")).toBe("en");
    expect(resolveLocale({ getLocale: () => "ar" })).toBe("ar");
  });

  it("builds locale-specific cache keys", () => {
    expect(buildLocalizedCacheKey("categories", "ar")).toBe("categories:ar");
    expect(buildLocalizedCacheKey("categories", "en")).toBe("categories:en");
  });

  it("clears all locale variants from cache", () => {
    const cache = { del: jest.fn() };

    clearLocalizedCache(cache, "faqs");

    expect(cache.del).toHaveBeenCalledTimes(2);
    expect(cache.del).toHaveBeenNthCalledWith(1, "faqs:en");
    expect(cache.del).toHaveBeenNthCalledWith(2, "faqs:ar");
  });

  it("localizes nested objects and arrays", () => {
    const payload = {
      name: { en: "Engineering", ar: "الهندسة" },
      description: { en: "English description", ar: "وصف عربي" },
      cities: [{ name: { en: "Cairo", ar: "القاهرة" } }],
    };

    expect(localizeData(payload, "ar")).toEqual({
      name: "الهندسة",
      description: "وصف عربي",
      cities: [{ name: "القاهرة" }],
    });
  });
});
