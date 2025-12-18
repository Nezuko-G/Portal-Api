import { JobModel } from "../../models/Job/job.model.js";
import { BadRequestError, NotFoundError } from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";
import { slugify } from "../../utils/helpers.js";

export const createJobController = async (req, res, next) => {
  try {
    const data = req.body;

    if (!data.title) {
      throw new BadRequestError("Job title is required");
    }

    const slug = slugify(data.title);

    const newJob = new JobModel({ ...data, slug });
    await newJob.save();

    res.status(201).json({
      message: "Job created successfully",
      data: newJob,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllJobsController = async (req, res, next) => {
  try {
    const jobs = await JobModel.find({
      is_deleted: false,
      is_active: true,
    }).select("-__v");

    res.json({
      message: "Jobs fetched successfully",
      total: jobs.length,
      data: jobs,
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
    }).select("-__v");

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    res.json({
      message: "Job fetched successfully",
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
      throw new NotFoundError("Job not found");
    }

    if (job.is_deleted) {
      throw new BadRequestError("Job is already deleted");
    }

    job.is_deleted = true;
    await job.save();

    res.json({
      message: "Job deleted successfully",
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
      throw new BadRequestError("Update data is required");
    }

    let updateData = { ...req.body };

    const job = await JobModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    res.json({
      message: "Job updated successfully",
      data: job,
    });
  } catch (error) {
    next(error);
  }
};
