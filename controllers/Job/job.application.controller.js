import { JobApplicationModel } from "../../models/JobApplication/job.application.model.js";
import { JobModel } from "../../models/Job/job.model.js";
import User from "../../models/User/user.model.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnAuthorizedError,
} from "../../Errors/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

// Apply to a job
export const applyToJobController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;

    // Check if user is authenticated
    if (!userId) {
      throw new UnAuthorizedError("You must be logged in to apply for a job");
    }

    // Validate job ID
    validateObjectId(jobId, "job id");

    // Check if user exists and is active
    const user = await User.findOne({
      _id: userId,
      is_deleted: false,
      is_active: true,
    });

    if (!user) {
      throw new NotFoundError("User not found or inactive");
    }

    // Check if user has uploaded CV
    if (!user.cv) {
      throw new BadRequestError(
        "You must upload your CV before applying for jobs"
      );
    }

    // Check if job exists and is active
    const job = await JobModel.findOne({
      _id: jobId,
      is_deleted: false,
      is_active: true,
    });

    if (!job) {
      throw new NotFoundError("Job not found or inactive");
    }

    // Check if job has expired
    if (new Date() > new Date(job.expirationDate)) {
      throw new BadRequestError("This job posting has expired");
    }

    // Check if user has already applied to this job
    const existingApplication = await JobApplicationModel.findOne({
      user: userId,
      job: jobId,
      is_deleted: false,
    });

    if (existingApplication) {
      throw new ConflictError("You have already applied to this job");
    }

    // Create new job application
    const newApplication = new JobApplicationModel({
      user: userId,
      job: jobId,
    });

    await newApplication.save();

    // Populate the response
    const populatedApplication = await JobApplicationModel.findById(
      newApplication._id
    )
      .populate({
        path: "user",
        select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
      })
      .populate({
        path: "job",
        populate: [
          { path: "fieldOfWork" },
          { path: "experienceLevel" },
          { path: "keywords" },
          { path: "country" },
        ],
      })
      .select("-__v");

    res.status(201).json({
      message: "Application submitted successfully",
      data: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// Get all applications for a user
export const getMyApplicationsController = async (req, res, next) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnAuthorizedError("You must be logged in");
    }

    const { status, page = 1, limit = 10 } = req.query;

    const query = {
      user: userId,
      is_deleted: false,
    };

    // Filter by status if provided
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await JobApplicationModel.find(query)
      .populate({
        path: "job",
        populate: [
          { path: "fieldOfWork" },
          { path: "experienceLevel" },
          { path: "keywords" },
          { path: "country" },
        ],
      })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobApplicationModel.countDocuments(query);

    res.json({
      message: "Applications fetched successfully",
      data: applications,
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

// Get single application details
export const getApplicationDetailsController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnAuthorizedError("You must be logged in");
    }

    validateObjectId(id, "application id");

    const application = await JobApplicationModel.findOne({
      _id: id,
      user: userId,
      is_deleted: false,
    })
      .populate({
        path: "user",
        select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
      })
      .populate({
        path: "job",
        populate: [
          { path: "fieldOfWork" },
          { path: "experienceLevel" },
          { path: "keywords" },
          { path: "country" },
        ],
      })
      .select("-__v");

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    res.json({
      message: "Application fetched successfully",
      data: application,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel/withdraw application (soft delete)
export const cancelApplicationController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      throw new UnAuthorizedError("You must be logged in");
    }

    validateObjectId(id, "application id");

    const application = await JobApplicationModel.findOne({
      _id: id,
      user: userId,
      is_deleted: false,
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    // Only allow cancellation if application is still pending
    if (application.status !== "pending") {
      throw new BadRequestError(
        `Cannot cancel application with status: ${application.status}`
      );
    }

    application.is_deleted = true;
    await application.save();

    res.json({
      message: "Application cancelled successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all applications for a specific job
export const getJobApplicationsController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    validateObjectId(jobId, "job id");

    // Check if job exists
    const job = await JobModel.findOne({
      _id: jobId,
      is_deleted: false,
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const query = {
      job: jobId,
      is_deleted: false,
    };

    // Filter by status if provided
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await JobApplicationModel.find(query)
      .populate({
        path: "user",
        select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
      })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobApplicationModel.countDocuments(query);

    // Get status counts
    const statusCounts = await JobApplicationModel.aggregate([
      { $match: { job: job._id, is_deleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      total: await JobApplicationModel.countDocuments({
        job: jobId,
        is_deleted: false,
      }),
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    statusCounts.forEach((item) => {
      stats[item._id] = item.count;
    });

    res.json({
      message: "Job applications fetched successfully",
      data: applications,
      stats,
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

// Admin: Update application status
export const updateApplicationStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    validateObjectId(id, "application id");

    if (!status || !["pending", "accepted", "rejected"].includes(status)) {
      throw new BadRequestError(
        "Invalid status. Must be pending, accepted, or rejected"
      );
    }

    const application = await JobApplicationModel.findOne({
      _id: id,
      is_deleted: false,
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    application.status = status;
    await application.save();

    const populatedApplication = await JobApplicationModel.findById(
      application._id
    )
      .populate({
        path: "user",
        select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
      })
      .populate({
        path: "job",
        populate: [
          { path: "fieldOfWork" },
          { path: "experienceLevel" },
          { path: "keywords" },
          { path: "country" },
        ],
      })
      .select("-__v");

    res.json({
      message: "Application status updated successfully",
      data: populatedApplication,
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Get all applications across all jobs
export const getAllApplicationsController = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = {
      is_deleted: false,
    };

    // Filter by status if provided
    if (status && ["pending", "accepted", "rejected"].includes(status)) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const applications = await JobApplicationModel.find(query)
      .populate({
        path: "user",
        select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
      })
      .populate({
        path: "job",
        populate: [
          { path: "fieldOfWork" },
          { path: "experienceLevel" },
          { path: "keywords" },
          { path: "country" },
        ],
      })
      .select("-__v")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await JobApplicationModel.countDocuments(query);

    // Get status counts
    const statusCounts = await JobApplicationModel.aggregate([
      { $match: { is_deleted: false } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const stats = {
      total: await JobApplicationModel.countDocuments({ is_deleted: false }),
      pending: 0,
      accepted: 0,
      rejected: 0,
    };

    statusCounts.forEach((item) => {
      stats[item._id] = item.count;
    });

    res.json({
      message: "All applications fetched successfully",
      data: applications,
      stats,
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
