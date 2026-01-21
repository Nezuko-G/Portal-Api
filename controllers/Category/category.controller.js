import { Category } from "../../models/Category/category.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";

const cacheKey = "categories";

// Create a new category
export const createCategoryController = async (req, res, next) => {
  try {
    const { body: data } = req;

    if (!data.name) {
      throw new BadRequestError(res._t("category.name_required"));
    }

    if (!JOB_CATEGORIES.includes(data.name)) {
      throw new BadRequestError(
        res._t("category.invalid_category", {
          categories: JOB_CATEGORIES.join(", "),
        }),
      );
    }

    const existingCategory = await Category.findOne({
      name: data.name,
      is_deleted: false,
    });

    if (existingCategory) {
      throw new BadRequestError(res._t("category.already_exists"));
    }

    const slug = slugify(data.name);
    const newCategory = new Category({ slug, ...data });

    await newCategory.save();
    cache.del(cacheKey);

    res.status(201).json({
      message: res._t("category.created"),
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

// Get all categories with caching
export const getAllCategoriesController = async (req, res, next) => {
  try {
    const cachedCategories = cache.get(cacheKey);

    if (cachedCategories) {
      return res.json(cachedCategories);
    }

    console.log("fetching from db");

    const categories = await Category.find({ is_deleted: false }).select(
      "-__v",
    );

    const response = {
      message: res._t("category.fetched_all"),
      total: categories.length,
      data: categories,
    };

    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Get a single category by id
export const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    const category = await Category.findOne({
      _id: id,
      is_deleted: false,
    }).select("-__v");

    if (!category) {
      throw new NotFoundError(res._t("category.not_found"));
    }

    res.json({
      message: res._t("category.fetched"),
      data: category,
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

    validateObjectId(id, "category id");

    if (!updateData || Object.keys(updateData).length === 0) {
      throw new BadRequestError(res._t("category.update_required"));
    }

    if (updateData.name && !JOB_CATEGORIES.includes(updateData.name)) {
      throw new BadRequestError(
        res._t("category.invalid_category", {
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
      throw new NotFoundError(res._t("category.not_found"));
    }

    cache.del(cacheKey);

    res.json({
      message: res._t("category.updated"),
      data: category,
    });
  } catch (error) {
    next(error);
  }
};
