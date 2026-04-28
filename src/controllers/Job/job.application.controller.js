import { JobApplicationModel } from "../../models/JobApplication/job.application.model.js";
import { JobModel } from "../../models/Job/job.model.js";
import User from "../../models/User/user.model.js";
import {
  BadRequestError,
  NotFoundError,
  ConflictError,
  UnAuthorizedError,
} from "../../utils/error.js";
import { validateObjectId } from "../../utils/validateObjectId.js";

// Helper to populate application
const populateApplication = (query) =>
  query.populate({
    path: "user",
    select: "-password -resetPasswordCode -resetPasswordCodeExpires -__v",
  })
  .populate({
    path: "job",
    populate: ["fieldOfWork", "experienceLevel", "keywords", "country"],
  })
  .select("-__v");


// Apply to a job
export const applyToJobController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedError(res._t("job_application.login_required"));

    validateObjectId(jobId, "job id");

    const user = await User.findOne({ _id: userId, is_deleted: false, is_active: true });
    if (!user) throw new NotFoundError(res._t("job_application.user_not_found"));
    if (!user.cv) throw new BadRequestError(res._t("job_application.cv_required"));

    const job = await JobModel.findOne({ _id: jobId, is_deleted: false, is_active: true });
    if (!job) throw new NotFoundError(res._t("job_application.job_not_found"));
    if (new Date() > new Date(job.expirationDate)) {
      throw new BadRequestError(res._t("job_application.job_expired"));
    }

    const existingApplication = await JobApplicationModel.findOne({
      user: userId,
      job: jobId,
      is_deleted: false,
    });
    if (existingApplication) throw new ConflictError(res._t("job_application.already_applied"));

    const newApplication = new JobApplicationModel({ user: userId, job: jobId });
    await newApplication.save();

    const populated = await populateApplication(JobApplicationModel.findById(newApplication._id));

    res.status(201).json({ message: res._t("job_application.created"), data: populated });
  } catch (error) {
    next(error);
  }
};

// Get current user's applications
export const getMyApplicationsController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedError(res._t("job_application.login_required"));

    const { status, page = 1, limit = 10 } = req.query;

    const query = { user: userId, is_deleted: false };
    if (status && ["pending", "accepted", "rejected"].includes(status)) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total] = await Promise.all([
      populateApplication(JobApplicationModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))),
      JobApplicationModel.countDocuments(query),
    ]);

    res.json({
      message: res._t("job_application.fetched_all"),
      data: applications,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (error) {
    next(error);
  }
};

// Get single application
export const getApplicationDetailsController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedError(res._t("job_application.login_required"));

    const { id } = req.params;
    validateObjectId(id, "application id");

    const application = await populateApplication(JobApplicationModel.findOne({ _id: id, user: userId, is_deleted: false }));
    if (!application) throw new NotFoundError(res._t("job_application.not_found"));

    res.json({ message: res._t("job_application.fetched"), data: application });
  } catch (error) {
    next(error);
  }
};

// Cancel pending application
export const cancelApplicationController = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) throw new UnAuthorizedError(res._t("job_application.login_required"));

    const { id } = req.params;
    validateObjectId(id, "application id");

    const application = await JobApplicationModel.findOne({ _id: id, user: userId, is_deleted: false });
    if (!application) throw new NotFoundError(res._t("job_application.not_found"));
    if (application.status !== "pending") throw new BadRequestError(res._t("job_application.cannot_cancel", { status: application.status }));

    application.is_deleted = true;
    await application.save();

    res.json({ message: res._t("job_application.cancelled") });
  } catch (error) {
    next(error);
  }
};


// Get applications for a job
export const getJobApplicationsController = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    validateObjectId(jobId, "job id");

    const job = await JobModel.findOne({ _id: jobId, is_deleted: false });
    if (!job) throw new NotFoundError(res._t("job_application.job_not_found"));

    const query = { job: jobId, is_deleted: false };
    if (status && ["pending", "accepted", "rejected"].includes(status)) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total, statusCounts] = await Promise.all([
      populateApplication(JobApplicationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))),
      JobApplicationModel.countDocuments(query),
      JobApplicationModel.aggregate([{ $match: { job: job._id, is_deleted: false } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const stats = { total, pending: 0, accepted: 0, rejected: 0 };
    statusCounts.forEach(s => stats[s._id] = s.count);

    res.json({ message: res._t("job_application.job_applications_fetched"), data: applications, stats, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};

// Update application status
export const updateApplicationStatusController = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    validateObjectId(id, "application id");
    if (!status || !["pending", "accepted", "rejected"].includes(status)) throw new BadRequestError(res._t("job_application.invalid_status"));

    const application = await JobApplicationModel.findOne({ _id: id, is_deleted: false });
    if (!application) throw new NotFoundError(res._t("job_application.not_found"));

    application.status = status;
    await application.save();

    const populated = await populateApplication(JobApplicationModel.findById(application._id));

    res.json({ message: res._t("job_application.status_updated"), data: populated });
  } catch (error) {
    next(error);
  }
};

// Get all applications
export const getAllApplicationsController = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const query = { is_deleted: false };
    if (status && ["pending", "accepted", "rejected"].includes(status)) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [applications, total, statusCounts] = await Promise.all([
      populateApplication(JobApplicationModel.find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))),
      JobApplicationModel.countDocuments(query),
      JobApplicationModel.aggregate([{ $match: { is_deleted: false } }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    ]);

    const stats = { total, pending: 0, accepted: 0, rejected: 0 };
    statusCounts.forEach(s => stats[s._id] = s.count);

    res.json({ message: res._t("job_application.all_applications_fetched"), data: applications, stats, pagination: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) {
    next(error);
  }
};
