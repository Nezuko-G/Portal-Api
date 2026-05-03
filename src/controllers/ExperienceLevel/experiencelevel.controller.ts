import { Request, Response, NextFunction } from "express";
import { ExperienceLevelModel } from "../../models/ExperienceLevel/experience.level.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { localizeData, resolveLocale } from "../../utils/helpers.js";

// Create a new experience level
export const createExperienceLevelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, minYears, maxYears } = req.body;
    const conflicts: any = {};
    const locale = resolveLocale(req);

    if (!title?.en || !title?.ar) {
      conflicts.title = "Title in both English and Arabic is required";
    }
    if (minYears === undefined || minYears === null) {
      conflicts.minYears = "Minimum years of experience is required";
    }
    if (maxYears === undefined || maxYears === null) {
      conflicts.maxYears = "Maximum years of experience is required";
    }

    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }

    const slug = slugify(title.en);
    const existExperienceLevel = await ExperienceLevelModel.findOne({
      slug,
      is_deleted: false,
    });

    if (existExperienceLevel) {
      throw new BadRequestError(
        (res as any).__("experience_level.already_exists"),
      );
    }

    const newExperienceLevel = new ExperienceLevelModel({
      title,
      slug,
      minYears,
      maxYears,
    });
    await newExperienceLevel.save();

    res.status(201).json({
      message: (res as any).__("experience_level.created"),
      data: localizeData(newExperienceLevel, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Get all experience levels
export const getAllExperienceLevelsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const lang = resolveLocale(req);
    const experienceLevels = await ExperienceLevelModel.find({
      is_deleted: false,
    })
      .select("-__v")
      .lean();

    const localizedData = localizeData(experienceLevels, lang);

    res.json({
      message: (res as any).__("experience_level.fetched_all"),
      total: localizedData.length,
      data: localizedData,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single experience level by id
export const getExperienceLevelByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const lang = resolveLocale(req);

    validateObjectId(id);
    const experienceLevel = await ExperienceLevelModel.findOne({
      _id: id,
      is_deleted: false,
    })
      .select("-__v")
      .lean();

    if (!experienceLevel) {
      throw new NotFoundError((res as any).__("experience_level.not_found"));
    }

    const localizedData = localizeData(experienceLevel, lang);

    res.json({
      message: (res as any).__("experience_level.fetched"),
      data: localizedData,
    });
  } catch (error) {
    next(error);
  }
};

// Update an experience level
export const updateExperienceLevelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;
    const locale = resolveLocale(req);
    validateObjectId(id);

    const conflicts: any = {};
    if (data.title && (!data.title.en || !data.title.ar)) {
      conflicts.title = "Title in both English and Arabic is required";
    }
    if (data.title && (data.title.en === "" || data.title.ar === "")) {
      conflicts.title = "Title cannot be empty";
    }
    if (Object.keys(conflicts).length > 0) {
      throw new BadRequestError("Validation Error", conflicts);
    }

    const experienceLevel = await ExperienceLevelModel.findOne({
      _id: id,
      is_deleted: false,
    });
    if (!experienceLevel) {
      throw new NotFoundError((res as any).__("experience_level.not_found"));
    }

    // Update slug if title changes
    if (data.title?.en && data.title.en !== experienceLevel.title?.en) {
      const newSlug = slugify(data.title.en);
      const duplicate = await ExperienceLevelModel.findOne({
        slug: newSlug,
        is_deleted: false,
      });
      if (duplicate) {
        throw new BadRequestError(
          (res as any).__("experience_level.already_exists"),
        );
      }
      data.slug = newSlug;
    }

    Object.assign(experienceLevel, data);
    await experienceLevel.save();

    res.json({
      message: (res as any).__("experience_level.updated"),
      data: localizeData(experienceLevel, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete an experience level
export const deleteExperienceLevelController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    validateObjectId(id);

    const experienceLevel = await ExperienceLevelModel.findOne({
      _id: id,
      is_deleted: false,
    });
    if (!experienceLevel) {
      throw new NotFoundError((res as any).__("experience_level.not_found"));
    }

    experienceLevel.is_deleted = true;
    await experienceLevel.save();

    res.json({
      message: (res as any).__("experience_level.deleted"),
    });
  } catch (error) {
    next(error);
  }
};
