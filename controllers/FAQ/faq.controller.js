import { FAQModel } from "../../models/FAQ/faq.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createFAQController = async (req, res, next) => {
  try {
    const data = req.body;
    const conflicts = {};
    if (!data.question) {
      conflicts.question = "Question is required";
    }
    if (!data.answer) {
      conflicts.answer = "Answer is required";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }
    const existingFAQ = await FAQModel.findOne({
      question: data.question,
      is_deleted: false,
    });
    if (existingFAQ) {
      throw new BadRequestError("FAQ with this question already exists");
    }
    const slug = slugify(data.question);
    const newFAQ = new FAQModel({
      slug: slug,
      ...data,
    });
    await newFAQ.save();
    res.status(201).json({
      message: "FAQ created successfully",
      data: newFAQ,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFAQController = async (req, res, next) => {
  try {
    const faqs = await FAQModel.find({ is_deleted: false }).select("-__v");
    res.json({
      message: "FAQs fetched successfully",
      total: faqs.length,
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

export const getFAQByIdController = async (req, res, next) => {
  try {
    const faqId = req.params.id;
    validateObjectId(faqId);
    const faq = await FAQModel.findOne({
      _id: faqId,
      is_deleted: false,
    }).select("-__v");
    if (!faq) {
      throw new NotFoundError("FAQ not found");
    }
    res.json({
      message: "FAQ fetched successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

export const updateFAQController = async (req, res, next) => {
  try {
    const faqId = req.params.id;
    validateObjectId(faqId);
    const data = req.body;
    const conflicts = {};
    if (data.question === "") {
      conflicts.question = "Question cannot be empty";
    }
    if (data.answer === "") {
      conflicts.answer = "Answer cannot be empty";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }
    const faq = await FAQModel.findOne({
      _id: faqId,
      is_deleted: false,
    });
    if (!faq) {
      throw new NotFoundError("FAQ not found");
    }
    if (data.question && data.question !== faq.question) {
      const existingFAQ = await FAQModel.findOne({
        question: data.question,
        is_deleted: false,
      });
      if (existingFAQ) {
        throw new BadRequestError("FAQ with this question already exists");
      }
      faq.slug = slugify(data.question);
    }
    Object.assign(faq, data);
    await faq.save();
    res.json({
      message: "FAQ updated successfully",
      data: faq,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteFAQController = async (req, res, next) => {
  try {
    const faqId = req.params.id;
    validateObjectId(faqId);
    const faq = await FAQModel.findOne({
      _id: faqId,
      is_deleted: false,
    });
    if (!faq) {
      throw new NotFoundError("FAQ not found");
    }
    faq.is_deleted = true;
    await faq.save();
    res.json({
      message: "FAQ deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};