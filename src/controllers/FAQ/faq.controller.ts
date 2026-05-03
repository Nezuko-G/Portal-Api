import { Request, Response, NextFunction } from "express";
import { Faq } from "../../models/FAQ/faq.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";
import {
  buildLocalizedCacheKey,
  clearLocalizedCache,
  localizeData,
  resolveLocale,
} from "../../utils/helpers.js";

const cacheKey = "faqs";

// Create a new FAQ
export const createFAQController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { question, answer } = req.body;
    const locale = resolveLocale(req);
    const conflicts: any = {};

    if (!question)
      conflicts.question = (res as any)._t("faq.question_required");
    if (!answer) conflicts.answer = (res as any)._t("faq.answer_required");
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(
        (res as any)._t("faq.validation_error"),
        conflicts,
      );
    }

    const existingFAQ = await Faq.findOne({
      "question.en": question.en,
      is_deleted: false,
    });
    if (existingFAQ)
      throw new BadRequestError((res as any)._t("faq.already_exists"));

    const slug = slugify(question.en);
    const newFAQ = new Faq({ slug, question, answer });
    await newFAQ.save();

    clearLocalizedCache(cache, cacheKey);

    res.status(201).json({
      message: (res as any)._t("faq.created"),
      data: localizeData(newFAQ, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Get all FAQs with caching
export const getAllFAQController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const localizedCacheKey = buildLocalizedCacheKey(cacheKey, locale);
    const cachedFaqs = cache.get(localizedCacheKey);
    if (cachedFaqs) {
      res.json({
        message: (res as any)._t("faq.fetched_from_cache"),
        total: (cachedFaqs as any).data.length,
        data: (cachedFaqs as any).data,
      });
      return;
    }

    const faqs = await Faq.find({ is_deleted: false }).select("-__v");
    const localizedFaqs = localizeData(faqs, locale);
    const response = {
      message: (res as any)._t("faq.fetched_all"),
      total: localizedFaqs.length,
      data: localizedFaqs,
    };
    cache.set(localizedCacheKey, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single FAQ by ID
export const getFAQByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const locale = resolveLocale(req);
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false }).select(
      "-__v",
    );
    if (!faq) throw new NotFoundError((res as any)._t("faq.not_found"));

    res.json({
      message: (res as any)._t("faq.fetched"),
      data: localizeData(faq, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Update an FAQ
export const updateFAQController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { question, answer } = req.body;
    const locale = resolveLocale(req);
    validateObjectId(id);

    const conflicts: any = {};
    if (question === "")
      conflicts.question = (res as any)._t("faq.question_empty");
    if (answer === "") conflicts.answer = (res as any)._t("faq.answer_empty");
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError(
        (res as any)._t("faq.validation_error"),
        conflicts,
      );
    }

    const faq = await Faq.findOne({ _id: id, is_deleted: false });
    if (!faq) throw new NotFoundError((res as any)._t("faq.not_found"));

    if (question && question.en !== faq.question?.en) {
      const existingFAQ = await Faq.findOne({
        "question.en": question.en,
        is_deleted: false,
      });
      if (existingFAQ)
        throw new BadRequestError((res as any)._t("faq.already_exists"));
      (faq as any).slug = slugify(question.en);
    }

    Object.assign(faq, req.body);
    await faq.save();

    clearLocalizedCache(cache, cacheKey);

    res.json({
      message: (res as any)._t("faq.updated"),
      data: localizeData(faq, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete an FAQ
export const deleteFAQController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    validateObjectId(id);

    const faq = await Faq.findOne({ _id: id, is_deleted: false });
    if (!faq) throw new NotFoundError((res as any)._t("faq.not_found"));

    faq.is_deleted = true;
    await faq.save();

    clearLocalizedCache(cache, cacheKey);

    res.json({
      message: (res as any)._t("faq.deleted"),
    });
  } catch (error) {
    next(error);
  }
};
