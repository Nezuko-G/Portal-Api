export const setCookieToken = (res, token, req) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production" &&
      (req.secure || req.headers["x-forwarded-proto"] === "https"),
    sameSite: "strict", // Added CSRF protection
  };

  res.cookie("jwt", token, cookieOptions);
};

export const generateResetCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s\_]+/g, "-") // spaces & underscores → hyphens
    .replace(/[^\w\-]+/g, "") // remove non-word chars
    .replace(/\-\-+/g, "-") // collapse multiple hyphens
    .replace(/^-+|-+$/g, ""); // trim hyphens from start/end
}

export const SUPPORTED_LOCALES = ["en", "ar"];

export const normalizeLocale = (locale = "en") =>
  String(locale).toLowerCase().startsWith("ar") ? "ar" : "en";

export const resolveLocale = (input) => {
  if (typeof input === "string") {
    return normalizeLocale(input);
  }

  const requestedLocale =
    input?.getLocale?.() ||
    input?.query?.lang ||
    input?.headers?.["accept-language"]?.split(",")[0] ||
    "en";

  return normalizeLocale(requestedLocale);
};

export const buildLocalizedCacheKey = (baseKey, locale) =>
  `${baseKey}:${normalizeLocale(locale)}`;

export const clearLocalizedCache = (cache, baseKey) => {
  SUPPORTED_LOCALES.forEach((locale) => {
    cache.del(buildLocalizedCacheKey(baseKey, locale));
  });
};

const isLocalizedPair = (value) =>
  value &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.prototype.hasOwnProperty.call(value, "en") &&
  Object.prototype.hasOwnProperty.call(value, "ar");

export const localizeData = (data, locale = "en") => {
  if (data === null || data === undefined) {
    return data;
  }

  const activeLocale = normalizeLocale(locale);

  if (Array.isArray(data)) {
    return data.map((item) => localizeData(item, activeLocale));
  }

  if (typeof data !== "object") {
    return data;
  }

  const source = typeof data.toObject === "function" ? data.toObject() : data;

  if (isLocalizedPair(source)) {
    return source[activeLocale] || source.en || source.ar;
  }

  const localized = {};

  for (const [key, value] of Object.entries(source)) {
    localized[key] = localizeData(value, activeLocale);
  }

  return localized;
};

export const localizedStringField = (options = {}) => ({
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
