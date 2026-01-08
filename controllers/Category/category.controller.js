import { Category } from "../../models/Category/category.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import { slugify } from "../../utils/helpers.js";
import { cache } from "../../config/cache.js";

const cacheKey = "categories";

export const createCategoryController = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.name) throw new BadRequestError("Category name is required");
    if (!JOB_CATEGORIES.includes(data.name))
      throw new BadRequestError(
        `Category must be one of: ${JOB_CATEGORIES.join(", ")}`
      );

    const existingCategory = await Category.findOne({
      name: data.name,
      is_deleted: false,
    });
    if (existingCategory)
      throw new BadRequestError("Category is Already Exist");

    const slug = slugify(data.name);
    const newCategory = new Category({ slug, ...data });
    await newCategory.save();

    cache.del(cacheKey);

    res
      .status(201)
      .json({ message: "Category created successfully", data: newCategory });
  } catch (error) {
    next(error);
  }
};

export const getAllCategoriesController = async (req, res, next) => {
  try {
    const cachedCategories = cache.get(cacheKey);

    if (cachedCategories) return res.json(cachedCategories);

    console.log("fetching from db");
    

    const categories = await Category.find({ is_deleted: false }).select(
      "-__v"
    );

    const response = {
      message: "Categories fetched successfully",
      total: categories.length,
      data: categories,
    };

    cache.set(cacheKey, response);

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getOneCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    const category = await Category.findOne({
      _id: id,
      is_deleted: false,
    }).select("-__v");
    if (!category) throw new NotFoundError("Category not found");

    const response = {
      message: "Category fetched successfully",
      data: category,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    const category = await Category.findById(id).select("-__v");
    if (!category) throw new NotFoundError("Category not found");
    if (category.is_deleted)
      throw new BadRequestError("Category is already deleted");

    category.is_deleted = true;
    await category.save();

    cache.del(cacheKey);

    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const updateCategoryController = async (req, res, next) => {
  try {
    const { id } = req.params;
    validateObjectId(id, "category id");

    if (!req.body || Object.keys(req.body).length === 0)
      throw new BadRequestError("Update data is required");
    if (req.body.name && !JOB_CATEGORIES.includes(req.body.name))
      throw new BadRequestError(
        `Category must be one of: ${JOB_CATEGORIES.join(", ")}`
      );

    const updateData = { ...req.body };
    const category = await Category.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");
    if (!category) throw new NotFoundError("Category not found");

    cache.del(cacheKey);

    res.json({ message: "Category updated successfully", data: category });
  } catch (error) {
    next(error);
  }
};
