import { KeywordModel } from "../../models/Keyword/keyword.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createKeywordController = async (req, res, next) => {
  try {
    const { word } = req.body;
    const conflicts = {};
    if (!word || !word.en || !word.ar) {
      conflicts.word = "Keyword in both English and Arabic is required";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }

    const slug = slugify(word.en);

    const existingKeyword = await KeywordModel.findOne({
      slug: slug,
      is_deleted: false,
    });
    if (existingKeyword) {
      conflicts.word = res.__("keyword.already_exists");
      throw new BadRequestError("Conflict Error", conflicts);
    }

    const newKeyword = new KeywordModel({
      word: word,
      slug: slug,
    });
    await newKeyword.save();
    res.status(201).json({
      message: res.__("keyword.created"),
      data: newKeyword,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllKeywordsController = async (req, res, next) => {
  try {
    const lang = req.query.lang || "en";
    const keywords = await KeywordModel.find({ is_deleted: false })
      .select("-__v")
      .lean();

    // Localize the data based on language
    const localizedData = keywords.map((item) => ({
      _id: item._id,
      word: item.word[lang] || item.word.en,
      slug: item.slug,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    res.json({
      message: res.__("keyword.fetched_all"),
      total: localizedData.length,
      data: localizedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getKeywordByIdController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    const lang = req.query.lang || "en";
    validateObjectId(keywordId);
    const keyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    })
      .select("-__v")
      .lean();
    if (!keyword) {
      throw new NotFoundError(res.__("keyword.not_found"));
    }

    // Localize the data based on language
    const localizedData = {
      _id: keyword._id,
      word: keyword.word[lang] || keyword.word.en,
      slug: keyword.slug,
      createdAt: keyword.createdAt,
      updatedAt: keyword.updatedAt,
    };

    res.json({
      message: res.__("keyword.fetched"),
      data: localizedData,
    });
  } catch (error) {
    next(error);
  }
};

export const updateKeywordController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    validateObjectId(keywordId);
    const { word } = req.body;
    const conflicts = {};
    if (!word || !word.en || !word.ar) {
      conflicts.word = "Keyword in both English and Arabic is required";
    }
    if (word && (word.en === "" || word.ar === "")) {
      conflicts.word = "Keyword cannot be empty";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }
    const existingKeyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    });
    if (!existingKeyword) {
      throw new NotFoundError(res.__("keyword.not_found"));
    }

    // If word is being updated, check for duplicates and update slug
    if (word && word.en && word.en !== existingKeyword.word.en) {
      const newSlug = slugify(word.en);
      const duplicateKeyword = await KeywordModel.findOne({
        slug: newSlug,
        is_deleted: false,
      });
      if (duplicateKeyword) {
        conflicts.word = res.__("keyword.already_exists");
        throw new BadRequestError("Conflict Error", conflicts);
      }
      existingKeyword.slug = newSlug;
    }

    existingKeyword.word = word;
    await existingKeyword.save();
    res.json({
      message: res.__("keyword.updated"),
      data: existingKeyword,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteKeywordController = async (req, res, next) => {
  try {
    const keywordId = req.params.id;
    validateObjectId(keywordId);
    const existingKeyword = await KeywordModel.findOne({
      _id: keywordId,
      is_deleted: false,
    });
    if (!existingKeyword) {
      throw new NotFoundError(res.__("keyword.not_found"));
    }
    existingKeyword.is_deleted = true;
    await existingKeyword.save();
    res.json({
      message: res.__("keyword.deleted"),
    });
  } catch (error) {
    next(error);
  }
};
