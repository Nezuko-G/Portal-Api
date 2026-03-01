import { Category } from "../../models/Category/category.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";
import {
  getPreferredLanguage,
  transformDocumentToLanguage,
  getMultilingualFields,
} from "../../utils/languageHelper.js";

const cacheKey = "categories";

// Create a new category
export const createCategoryController = async (req, res, next) => {
  try {
    const { body: data } = req;
    const lang = getPreferredLanguage(req);

    if (!data.name || !data.name.en || !data.name.ar) {
      throw new BadRequestError(res._t("category.name_required"));
    }

    const slug = slugify(data.name.en);
    const newCategory = new Category({ slug, ...data });

    await newCategory.save();
    cache.del(cacheKey);

    const multilingualFields = getMultilingualFields("Category");
    const transformedData = transformDocumentToLanguage(
      newCategory,
      lang,
      multilingualFields,
    );

    res.status(201).json({
      message: res._t("category.created"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories with caching
export const getAllCategoriesController = async (req, res, next) => {
  try {
    const lang = getPreferredLanguage(req);
    const cacheKeyWithLang = `${cacheKey}_${lang}`;
    const cachedCategories = cache.get(cacheKeyWithLang);

    if (cachedCategories) {
      return res.json(cachedCategories);
    }

    const categories = await Category.find({ is_deleted: false }).select(
      "-__v",
    );

    const multilingualFields = getMultilingualFields("Category");
    const transformedCategories = transformDocumentToLanguage(
      categories,
      lang,
      multilingualFields,
    );

    const response = {
      message: res._t("category.fetched_all"),
      total: transformedCategories.length,
      data: transformedCategories,
    };

    cache.set(cacheKeyWithLang, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single category by id
export const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lang = getPreferredLanguage(req);
    validateObjectId(id, "category id");

    const category = await Category.findOne({
      _id: id,
      is_deleted: false,
    }).select("-__v");

    if (!category) {
      throw new NotFoundError(res._t("category.not_found"));
    }

    const multilingualFields = getMultilingualFields("Category");
    const transformedData = transformDocumentToLanguage(
      category,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("category.fetched"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete a category
export const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    const category = await Category.findById(id).select("-__v");

    if (!category) {
      throw new NotFoundError(res._t("category.not_found"));
    }

    if (category.is_deleted) {
      throw new BadRequestError(res._t("category.already_deleted"));
    }

    category.is_deleted = true;
    await category.save();

    cache.del(cacheKey);

    res.json({
      message: res._t("category.deleted"),
    });
  } catch (error) {
    next(error);
  }
};

// Update category data
export const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const lang = getPreferredLanguage(req);

    validateObjectId(id, "category id");

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestError(res._t("category.update_required"));
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!category) {
      throw new NotFoundError(res._t("category.not_found"));
    }

    // Clear all language variants from cache
    cache.del(`${cacheKey}_en`);
    cache.del(`${cacheKey}_ar`);

    const multilingualFields = getMultilingualFields("Category");
    const transformedData = transformDocumentToLanguage(
      category,
      lang,
      multilingualFields,
    );

    res.json({
      message: res._t("category.updated"),
      data: transformedData,
    });
  } catch (error) {
    next(error);
  }
};
