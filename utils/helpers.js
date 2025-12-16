export const setCookieToken = (res, token, req) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
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

/**
 * Localize data based on language preference
 * @param {Object|Array} data - Data to localize
 * @param {String} lang - Language code ('en' or 'ar')
 * @param {Array} fieldsToLocalize - Fields that have en/ar structure
 * @returns {Object|Array} - Localized data
 */
export function localizeData(data, lang = 'en', fieldsToLocalize = ['title', 'word', 'name', 'question', 'answer', 'description']) {
  if (!data) return data;

  // Handle array of items
  if (Array.isArray(data)) {
    return data.map(item => localizeData(item, lang, fieldsToLocalize));
  }

  // Handle single object
  if (typeof data === 'object' && data !== null) {
    const localized = {};
    
    for (const key in data) {
      if (data[key] && typeof data[key] === 'object' && !Array.isArray(data[key])) {
        // Check if this field has localization structure (en/ar)
        if (fieldsToLocalize.includes(key) && data[key].en !== undefined && data[key].ar !== undefined) {
          // Return only the requested language
          localized[key] = data[key][lang] || data[key]['en'];
        } else if (data[key]._doc) {
          // Handle mongoose documents
          localized[key] = localizeData(data[key]._doc, lang, fieldsToLocalize);
        } else {
          // Recursively localize nested objects
          localized[key] = localizeData(data[key], lang, fieldsToLocalize);
        }
      } else {
        localized[key] = data[key];
      }
    }
    
    return localized;
  }

  return data;
}
