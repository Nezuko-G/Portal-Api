import { Faq } from "../../models/FAQ/faq.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";

const cacheKey = "faqs";

// Create a new FAQ
export const createFAQController = async (req, res, next) => {
  try {
    const { question, answer } = req.body;
    const conflicts = {};

    if (!question) conflicts.question = res._t("faq.question_required");
    if (!answer) conflicts.answer = res._t("faq.answer_required");
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(res._t("faq.validation_error"), conflicts);
    }

    const existingFAQ = await Faq.findOne({ question, is_deleted: false });
    if (existingFAQ) throw new BadRequestError(res._t("faq.already_exists"));

    const slug = slugify(question);
    const newFAQ = new Faq({ slug, question, answer });
    await newFAQ.save();

    cache.del(cacheKey);

    res.status(201).json({
      message: res._t("faq.created"),
      data: newFAQ,
    });
  } catch (error) {
    next(error);
  }
};

// Get all FAQs with caching
export const getAllFAQController = async (req, res, next) => {
  try {
    const cachedFaqs = cache.get(cacheKey);
    if (cachedFaqs) {
      return res.json({
        message: res._t("faq.fetched_from_cache"),
        total: cachedFaqs.length,
        data: cachedFaqs,
      });
    }

    const faqs = await Faq.find({ is_deleted: false }).select("-__v");
    cache.set(cacheKey, faqs);

    res.json({
      message: res._t("faq.fetched_all"),
      total: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single FAQ by ID
export const getFAQByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false }).select("-__v");
    if (!faq) throw new NotFoundError(res._t("faq.not_found"));

    res.json({
      message: res._t("faq.fetched"),
      data: faq,
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
    validateObjectId(id);

    const conflicts = {};
    if (question === "") conflicts.question = res._t("faq.question_empty");
    if (answer === "") conflicts.answer = res._t("faq.answer_empty");
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(res._t("faq.validation_error"), conflicts);
    }

    const faq = await Faq.findOne({ _id: id, is_deleted: false });
    if (!faq) throw new NotFoundError(res._t("faq.not_found"));

    if (question && question !== faq.question) {
      const existingFAQ = await Faq.findOne({ question, is_deleted: false });
      if (existingFAQ) throw new BadRequestError(res._t("faq.already_exists"));
      faq.slug = slugify(question);
    }

    Object.assign(faq, req.body);
    await faq.save();

    cache.del(cacheKey);

    res.json({
      message: res._t("faq.updated"),
      data: faq,
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
