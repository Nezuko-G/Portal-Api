import { KeywordModel } from "../../models/Keyword/keyword.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { localizeData, resolveLocale } from "../../utils/helpers.js";

// Localize keyword data
const localizeKeyword = (keyword, lang = "en") => ({
  _id: keyword._id,
  word: keyword.word[lang] || keyword.word.en,
  slug: keyword.slug,
  createdAt: keyword.createdAt,
  updatedAt: keyword.updatedAt,
});

// Validate keyword input
const validateKeywordInput = (word, res) => {
  const conflicts = {};
  if (!word || !word.en || !word.ar) {
    conflicts.word = "Keyword in both English and Arabic is required";
  }
  if (word && (word.en.trim() === "" || word.ar.trim() === "")) {
    conflicts.word = "Keyword cannot be empty";
  }
  if (Object.keys(conflicts).length > 0) {
    throw new BadRequestError("Validation Error", conflicts);
  }
};

// Create a new keyword
export const createKeywordController = async (req, res, next) => {
  try {
    const { word } = req.body;
    const locale = resolveLocale(req);

    validateKeywordInput(word, res);

    const slug = slugify(word.en);

    // Check for duplicate keyword
    const existingKeyword = await KeywordModel.findOne({
      slug,
      is_deleted: false,
    });

    if (existingKeyword) {
      throw new BadRequestError("Conflict Error", {
        word: "Keyword already exists",
      });
    }

    const newKeyword = new KeywordModel({ word, slug });
    await newKeyword.save();

    res.status(201).json({
      message: "Keyword created",
      data: localizeData(newKeyword, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Get all keywords
export const getAllKeywordsController = async (req, res, next) => {
  try {
    const lang = resolveLocale(req);
    const keywords = await KeywordModel.find({ is_deleted: false })
      .select("-__v")
      .lean();

    const localizedData = keywords.map((k) => localizeKeyword(k, lang));

    res.json({
      message: "Fetched all keywords",
      total: localizedData.length,
      data: localizedData,
    });
  } catch (error) {
    next(error);
  }
};

// Get keyword by ID
export const getKeywordByIdController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    const lang = resolveLocale(req);

    validateObjectId(keywordId);

    const keyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    })
      .select("-__v")
      .lean();

    if (!keyword) {
      throw new NotFoundError("Keyword not found");
    }

    res.json({
      message: "Keyword fetched",
      data: localizeKeyword(keyword, lang),
    });
  } catch (error) {
    next(error);
  }
};

// Update keyword
export const updateKeywordController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    validateObjectId(keywordId);

    const { word } = req.body;
    const locale = resolveLocale(req);
    validateKeywordInput(word, res);

    const existingKeyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    });

    if (!existingKeyword) {
      throw new NotFoundError("Keyword not found");
    }

    // Update slug if English word changed
    if (word.en !== existingKeyword.word.en) {
      const newSlug = slugify(word.en);

      const duplicateKeyword = await KeywordModel.findOne({
        slug: newSlug,
        is_deleted: false,
      });

      if (duplicateKeyword) {
        throw new BadRequestError("Conflict Error", {
          word: "Keyword already exists",
        });
      }

      existingKeyword.slug = newSlug;
    }

    existingKeyword.word = word;
    await existingKeyword.save();

    res.json({
      message: "Keyword updated",
      data: localizeData(existingKeyword, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Delete keyword
export const deleteKeywordController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    validateObjectId(keywordId);

    const existingKeyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    });

    if (!existingKeyword) {
      throw new NotFoundError("Keyword not found");
    }

    existingKeyword.is_deleted = true;
    await existingKeyword.save();

    res.json({
      message: "Keyword deleted",
    });
  } catch (error) {
    next(error);
  }
};
