import { JobModel } from "../../models/Job/job.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createJobController = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.title) {
      throw new BadRequestError(res._t("job.title_required"));
    }

    const slug = slugify(data.title);

    const newJob = new JobModel({ ...data, slug });
    await newJob.save();

    const populatedJob = await JobModel.findById(newJob._id)
      .populate("fieldOfWork")
      .populate("experienceLevel")
      .populate("keywords")
      .populate("country")
      .select("-__v");

    res.status(201).json({
      message: res._t("job.created"),
      data: populatedJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobsController = async (req, res, next) => {
  try {
    const {
      country,
      search,
      keyword,
      page = 1,
      limit = 10,
      fieldOfWork,
      experienceLevel,
      jobType,
      workMode,
    } = req.query;

    const query = {
      is_deleted: false,
      is_active: true,
    };

    if (country) {
      validateObjectId(country, "country id");
      query.country = country;
    }

    if (fieldOfWork) {
      validateObjectId(fieldOfWork, "field of work id");
      query.fieldOfWork = fieldOfWork;
    }

    if (experienceLevel) {
      validateObjectId(experienceLevel, "experience level id");
      query.experienceLevel = experienceLevel;
    }

    if (jobType && ["full-time", "part-time", "internship"].includes(jobType)) {
      query.jobType = jobType;
    }

    if (workMode && ["office", "remote", "hybrid"].includes(workMode)) {
      query.workMode = workMode;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (keyword) {
      validateObjectId(keyword, "keyword id");
      query.keywords = keyword;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await JobModel.find(query)
      .populate("fieldOfWork")
      .populate("experienceLevel")
      .populate("keywords")
      .populate("country")
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobModel.countDocuments(query);

    res.json({
      message: res._t("job.fetched_all"),
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getOneJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "job id");

    const job = await JobModel.findOne({
      _id: id,
      is_deleted: false,
      is_active: true,
    })
      .populate("fieldOfWork")
      .populate("experienceLevel")
      .populate("keywords")
      .populate("country")
      .select("-__v");

    if (!job) {
      throw new NotFoundError(res._t("job.not_found"));
    }

    res.json({
      message: res._t("job.fetched"),
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "job id");

    const job = await JobModel.findById(id).select("-__v");

    if (!job) {
      throw new NotFoundError(res._t("job.not_found"));
    }

    if (job.is_deleted) {
      throw new BadRequestError(res._t("job.already_deleted"));
    }

    job.is_deleted = true;
    await job.save();

    res.json({
      message: res._t("job.deleted"),
    });
  } catch (error) {
    next(error);
  }
};

export const updateJobController = async (req, res, next) => {
  try {
    const { id } = req.params;

    validateObjectId(id, "job id");

    if (!req.body || Object.keys(req.body).length === 0) {
      throw new BadRequestError(res._t("job.update_required"));
    }

    let updateData = { ...req.body };

    const job = await JobModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    )
      .populate("fieldOfWork")
      .populate("experienceLevel")
      .populate("keywords")
      .populate("country")
      .select("-__v");

    if (!job) {
      throw new NotFoundError(res._t("job.not_found"));
    }

    res.json({
      message: res._t("job.updated"),
      data: job,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleJobActivationController = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: res._t("job.title_required") });
  }
  const job = await JobModel.findById(id);
  if (!job) {
    return res.status(404).json({ message: res._t("job.not_found") });
  }
  job.is_active = !job.is_active;
  await job.save();
  return res.json({
    message: job.is_active
      ? res._t("job.activated")
      : res._t("job.deactivated"),
    data: job,
  });
};
