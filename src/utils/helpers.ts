import type { Response, Request } from "express";
import type NodeCache from "node-cache";

export const setCookieToken = (
  res: Response,
  token: string,
  req: Request,
): void => {
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        (parseInt(process.env.JWT_COOKIE_EXPIRES_IN as string, 10) || 7) *
          24 *
          60 *
          60 *
          1000,
    ),
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" &&
      ((req as any).secure || req.headers["x-forwarded-proto"] === "https"),
    sameSite: "strict" as const,
  };

  res.cookie("jwt", token, cookieOptions);
};

export const generateResetCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\_]+/g, "-") // spaces & underscores → hyphens
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim hyphens from start/end
}

export const SUPPORTED_LOCALES: string[] = ["en", "ar"];

export const normalizeLocale = (locale: string = "en"): string =>
  String(locale).toLowerCase().startsWith("ar") ? "ar" : "en";

export const resolveLocale = (input: any): string => {
  if (typeof input === "string") {
    return normalizeLocale(input);
  }

  const requestedLocale: string =
    input?.getLocale?.() ||
    input?.query?.lang ||
    input?.headers?.["accept-language"]?.split(",")[0] ||
    "en";

  return normalizeLocale(requestedLocale);
};

export const buildLocalizedCacheKey = (
  baseKey: string,
  locale: string,
): string => `${baseKey}:${normalizeLocale(locale)}`;

export const clearLocalizedCache = (
  cache: NodeCache,
  baseKey: string,
): void => {
  SUPPORTED_LOCALES.forEach((locale: string) => {
    cache.del(buildLocalizedCacheKey(baseKey, locale));
  });
};

const isLocalizedPair = (value: any): boolean =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.prototype.hasOwnProperty.call(value, "en") &&
  Object.prototype.hasOwnProperty.call(value, "ar");

const isPlainObject = (value: any): boolean => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

export const localizeData = (data: any, locale: string = "en"): any => {
  if (data === null || data === undefined) {
    return data;
  }

  const activeLocale = normalizeLocale(locale);

  if (Array.isArray(data)) {
    return data.map((item: any) => localizeData(item, activeLocale));
  }

  if (typeof data !== "object") {
    return data;
  }

  const source =
    typeof (data as any).toObject === "function"
      ? (data as any).toObject()
      : data;

  if (isLocalizedPair(source)) {
    return source[activeLocale] || source.en || source.ar;
  }

  if (!isPlainObject(source)) {
    return source;
  }

  const localized: Record<string, any> = {};

  for (const [key, value] of Object.entries(source)) {
    localized[key] = localizeData(value, activeLocale);
  }

  return localized;
};

interface LocalizedStringFieldOptions {
  required?: boolean;
}

export const localizedStringField = (
  options: LocalizedStringFieldOptions = {},
): Record<string, any> => ({
  en: {
    type: String,
    required: options.required ?? true,
    trim: true,
  },
  ar: {
    type: String,
    required: options.required ?? true,
    trim: true,
  },
});
