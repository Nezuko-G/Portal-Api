import { Request, Response, NextFunction } from "express";
import { JobModel } from "../../models/Job/job.model.js";
import { BadRequestError, NotFoundError } from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";
import { localizeData, resolveLocale } from "../../utils/helpers.js";

// Create a new Job
export const createJobController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { title, ...rest } = req.body;
    const locale = resolveLocale(req);
    if (!title)
      throw new BadRequestError((res as any)._t("job.title_required"));

    const slug = slugify(title.en);
    const newJob = new JobModel({ ...rest, title, slug });
    await newJob.save();

    const populatedJob = await JobModel.findById(newJob._id)
      .populate("fieldOfWork experienceLevel keywords country")
      .select("-__v");

    res.status(201).json({
      message: (res as any)._t("job.created"),
      data: localizeData(populatedJob, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Get all Jobs with filtering, search, pagination
export const getAllJobsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const {
      country,
      fieldOfWork,
      experienceLevel,
      jobType,
      workMode,
      keyword,
      search,
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = { is_deleted: false, is_active: true };

    if (country) {
      validateObjectId(country as string, "country id");
      query.country = country;
    }
    if (fieldOfWork) {
      validateObjectId(fieldOfWork as string, "field of work id");
      query.fieldOfWork = fieldOfWork;
    }
    if (experienceLevel) {
      validateObjectId(experienceLevel as string, "experience level id");
      query.experienceLevel = experienceLevel;
    }
    if (
      jobType &&
      ["full-time", "part-time", "internship"].includes(jobType as string)
    )
      query.jobType = jobType;
    if (workMode && ["office", "remote", "hybrid"].includes(workMode as string))
      query.workMode = workMode;
    if (keyword) {
      validateObjectId(keyword as string, "keyword id");
      query.keywords = keyword;
    }
    if (search)
      query.$or = [
        { "title.en": { $regex: search, $options: "i" } },
        { "title.ar": { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { organization: { $regex: search, $options: "i" } },
        { "description.en": { $regex: search, $options: "i" } },
        { "description.ar": { $regex: search, $options: "i" } },
        { "locationDetails.en": { $regex: search, $options: "i" } },
        { "locationDetails.ar": { $regex: search, $options: "i" } },
      ];

    const locale = resolveLocale(req);

    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

    const [jobs, total] = await Promise.all([
      JobModel.find(query)
        .populate("fieldOfWork experienceLevel keywords country")
        .select("-__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit as string)),
      JobModel.countDocuments(query),
    ]);

    res.json({
      message: (res as any)._t("job.fetched_all"),
      data: localizeData(jobs, locale),
      pagination: {
        total,
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        totalPages: Math.ceil(total / parseInt(limit as string)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get a single Job by ID
export const getOneJobController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const locale = resolveLocale(req);
    validateObjectId(id, "job id");

    const job = await JobModel.findOne({
      _id: id,
      is_deleted: false,
      is_active: true,
    })
      .populate("fieldOfWork experienceLevel keywords country")
      .select("-__v");

    if (!job) throw new NotFoundError((res as any)._t("job.not_found"));

    res.json({
      message: (res as any)._t("job.fetched"),
      data: localizeData(job, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Update Job
export const updateJobController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const locale = resolveLocale(req);
    validateObjectId(id, "job id");

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestError((res as any)._t("job.update_required"));
    }

    const job = await JobModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true },
    )
      .populate("fieldOfWork experienceLevel keywords country")
      .select("-__v");

    if (!job) throw new NotFoundError((res as any)._t("job.not_found"));

    res.json({
      message: (res as any)._t("job.updated"),
      data: localizeData(job, locale),
    });
  } catch (error) {
    next(error);
  }
};

// Soft delete Job
export const deleteJobController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    validateObjectId(id, "job id");

    const job = await JobModel.findById(id).select("-__v");
    if (!job) throw new NotFoundError((res as any)._t("job.not_found"));
    if (job.is_deleted)
      throw new BadRequestError((res as any)._t("job.already_deleted"));

    job.is_deleted = true;
    await job.save();

    res.json({ message: (res as any)._t("job.deleted") });
  } catch (error) {
    next(error);
  }
};

// Toggle Job Activation
export const toggleJobActivationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const locale = resolveLocale(req);
    validateObjectId(id, "job id");

    const job = await JobModel.findById(id);
    if (!job) throw new NotFoundError((res as any)._t("job.not_found"));

    job.is_active = !job.is_active;
    await job.save();

    res.json({
      message: job.is_active
        ? (res as any)._t("job.activated")
        : (res as any)._t("job.deactivated"),
      data: localizeData(job, locale),
    });
  } catch (error) {
    next(error);
  }
};
