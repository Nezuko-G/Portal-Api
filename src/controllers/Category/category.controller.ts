import { Request, Response, NextFunction } from "express";
import { Category } from "../../models/Category/category.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import {
  buildLocalizedCacheKey,
  clearLocalizedCache,
  localizeData,
  resolveLocale,
  slugify,
} from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";

const cacheKey = "categories";

// Create a new category
export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body: data } = req;
    const locale = resolveLocale(req);

    if (!data.name) {
      throw new BadRequestError((res as any)._t("category.name_required"));
    }

    if (!data.name.en || !JOB_CATEGORIES.includes(data.name.en)) {
      throw new BadRequestError(
        (res as any)._t("category.invalid_category", {
          categories: JOB_CATEGORIES.join(", "),
        }),
      );
    }

    const existingCategory = await Category.findOne({
      "name.en": data.name.en,
      is_deleted: false,
    });

    if (existingCategory) {
      throw new BadRequestError((res as any)._t("category.already_exists"));
    }

    const slug = slugify(data.name.en);
    const newCategory = new Category({ slug, ...data });

    await newCategory.save();
    clearLocalizedCache(cache, cacheKey);

    res.status(201).json({
      message: (res as any)._t("category.created"),
      data: localizeData(newCategory, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories with caching
export const getAllCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const locale = resolveLocale(req);
    const localizedCacheKey = buildLocalizedCacheKey(cacheKey, locale);
    const cachedCategories = cache.get(localizedCacheKey);

    if (cachedCategories) {
      res.json(cachedCategories);
      return;
    }

    console.log("fetching from db");

    const categories = await Category.find({ is_deleted: false }).select(
      "-__v",
    );

    const localizedCategories = localizeData(categories, locale);

    const response = {
      message: (res as any)._t("category.fetched_all"),
      total: localizedCategories.length,
      data: localizedCategories,
    };

    cache.set(localizedCacheKey, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single category by id
export const getOneCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const locale = resolveLocale(req);
    validateObjectId(id, "category id");

    const category = await Category.findOne({
      _id: id,
      is_deleted: false,
    }).select("-__v");

    if (!category) {
      throw new NotFoundError((res as any)._t("category.not_found"));
    }

    res.json({
      message: (res as any)._t("category.fetched"),
      data: localizeData(category, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete a category
export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    const category = await Category.findById(id).select("-__v");

    if (!category) {
      throw new NotFoundError((res as any)._t("category.not_found"));
    }

    if (category.is_deleted) {
      throw new BadRequestError((res as any)._t("category.already_deleted"));
    }

    category.is_deleted = true;
    await category.save();

    clearLocalizedCache(cache, cacheKey);

    res.json({
      message: (res as any)._t("category.deleted"),
    });
  } catch (error) {
    next(error);
  }
};

// Update category data
export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const locale = resolveLocale(req);

    validateObjectId(id, "category id");

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestError((res as any)._t("category.update_required"));
    }

    if (updateData.name && !JOB_CATEGORIES.includes(updateData.name.en)) {
      throw new BadRequestError(
        (res as any)._t("category.invalid_category", {
          categories: JOB_CATEGORIES.join(", "),
        }),
      );
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!category) {
      throw new NotFoundError((res as any)._t("category.not_found"));
    }

    clearLocalizedCache(cache, cacheKey);

    res.json({
      message: (res as any)._t("category.updated"),
      data: localizeData(category, locale),
    });
  } catch (error) {
    next(error);
  }
};
