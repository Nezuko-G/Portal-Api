/**
 * Get the preferred language from request
 * @param {Object} req - Express request object
 * @param {string} defaultLang - Default language (default: 'en')
 * @returns {string} - The language code (en or ar)
 */
export const getPreferredLanguage = (req, defaultLang = "en") => {
  const lang = req.query.lang || req.headers["accept-language"] || defaultLang;
  return ["en", "ar"].includes(lang) ? lang : defaultLang;
};

/**
 * Transform multilingual field to single language
 * @param {Object|string|Array} field - The field to transform (can be multilingual object or string)
 * @param {string} lang - The language code (en or ar)
 * @returns {Object|string|Array} - The transformed field
 */
export const transformFieldToLanguage = (field, lang) => {
  if (!field) return field;

  // If it's an object with language keys
  if (typeof field === "object" && field[lang]) {
    return field[lang];
  }

  // If it's an array (like responsibility/requirement items)
  if (Array.isArray(field)) {
    return field.map((item) => {
      if (item && typeof item === "object" && item[lang]) {
        return item[lang];
      }
      return item;
    });
  }

  // If it's already a string or other primitive
  return field;
};

/**
 * Transform a document or array of documents to preferred language
 * @param {Object|Array} data - The document(s) to transform
 * @param {string} lang - The language code
 * @param {Array} multilingualFields - Array of field names that are multilingual
 * @returns {Object|Array} - The transformed data
 */
export const transformDocumentToLanguage = (
  data,
  lang,
  multilingualFields = [],
) => {
  if (!data) return data;

  const isArray = Array.isArray(data);
  const documents = isArray ? data : [data];

  const transformed = documents.map((doc) => {
    if (!doc || typeof doc !== "object") return doc;

    // If it's a Mongoose document, convert to plain object
    const plainDoc = doc.toObject ? doc.toObject() : { ...doc };

    const result = {};

    for (const [key, value] of Object.entries(plainDoc)) {
      if (multilingualFields.includes(key)) {
        // Transform multilingual fields
        result[key] = transformFieldToLanguage(value, lang);
      } else {
        result[key] = value;
      }
    }

    return result;
  });

  return isArray ? transformed : transformed[0];
};

/**
 * Get default multilingual fields for common models
 * @param {string} modelName - The model name (e.g., 'Category', 'Job', 'FAQ')
 * @returns {Array} - Array of multilingual field names
 */
export const getMultilingualFields = (modelName) => {
  const fieldMap = {
    Category: ["name", "description"],
    FAQ: ["question", "answer"],
    Country: ["name", "cities"],
    Job: [
      "title",
      "company",
      "organization",
      "description",
      "responsibilities",
      "requirements",
    ],
    ExperienceLevel: ["title"],
    Keyword: ["word"],
    ContactUs: [],
    User: [],
    JobApplication: [],
  };

  return fieldMap[modelName] || [];
};
