import { Faq } from "../../models/FAQ/faq.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";
import {
  getPreferredLanguage,
  transformDocumentToLanguage,
  getMultilingualFields,
} from "../../utils/languageHelper.js";

const cacheKey = "faqs";

// Create a new FAQ
export const createFAQController = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const lang = getPreferredLanguage(req);
    const conflicts = {};

    if (!question || !question.en || !question.ar)
      conflicts.question = res._t("faq.question_required");
    if (!answer || !answer.en || !answer.ar)
      conflicts.answer = res._t("faq.answer_required");
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(res._t("faq.validation_error"), conflicts);
    }

    const slug = slugify(question.en);
    const newFAQ = new Faq({ slug, question, answer });
    await newFAQ.save();

    cache.del(`${cacheKey}_en`);
    cache.del(`${cacheKey}_ar`);

    const multilingualFields = getMultilingualFields("FAQ");
    const transformedData = transformDocumentToLanguage(
      newFAQ,
      lang,
      multilingualFields,
    );

    res.status(201).json({
      message: res._t("faq.created"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Get all FAQs with caching
export const getAllFAQController = async (req, res, next) => {
  try {
    const lang = getPreferredLanguage(req);
    const cacheKeyWithLang = `${cacheKey}_${lang}`;
    const cachedFaqs = cache.get(cacheKeyWithLang);

    if (cachedFaqs) {
      return res.json(cachedFaqs);
    }

    const faqs = await Faq.find({ is_deleted: false }).select("-__v");

    const multilingualFields = getMultilingualFields("FAQ");
    const transformedFaqs = transformDocumentToLanguage(
      faqs,
      lang,
      multilingualFields,
    );

    const response = {
      message: res._t("faq.fetched_all"),
      total: transformedFaqs.length,
      data: transformedFaqs,
    };

    cache.set(cacheKeyWithLang, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single FAQ by ID
export const getFAQByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = getPreferredLanguage(req);
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false }).select(
      "-__v",
    );
    if (!faq) throw new NotFoundError(res._t("faq.not_found"));

    const multilingualFields = getMultilingualFields("FAQ");
    const transformedData = transformDocumentToLanguage(
      faq,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("faq.fetched"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Update an FAQ
export const updateFAQController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const lang = getPreferredLanguage(req);
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false });
    if (!faq) throw new NotFoundError(res._t("faq.not_found"));

    if (question && question.en && question.en !== faq.question.en) {
      faq.slug = slugify(question.en);
    }

    Object.assign(faq, req.body);
    await faq.save();

    cache.del(`${cacheKey}_en`);
    cache.del(`${cacheKey}_ar`);

    const multilingualFields = getMultilingualFields("FAQ");
    const transformedData = transformDocumentToLanguage(
      faq,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("faq.updated"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete an FAQ
export const deleteFAQController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false });
    if (!faq) throw new NotFoundError(res._t("faq.not_found"));

    faq.is_deleted = true;
    await faq.save();

    cache.del(cacheKey);

    res.json({
      message: res._t("faq.deleted"),
    });
  } catch (error) {
    next(error);
  }
};
