import { Router } from "express";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  applyToJobController,
  getMyApplicationsController,
  getApplicationDetailsController,
  cancelApplicationController,
  getJobApplicationsController,
  updateApplicationStatusController,
  getAllApplicationsController,
} from "../../controllers/Job/job.application.controller.js";
import {
  updateApplicationStatusSchema,
  getApplicationsQuerySchema,
} from "../../validations/Job/job.application.validation.js";

const router = Router();

// ======================
// User Routes
// ======================

// Apply to a job
router.post("/apply/:jobId", authenticateToken, applyToJobController);

// Get all applications of the authenticated user
router.get(
  "/my-applications",
  authenticateToken,
  validate(getApplicationsQuerySchema, "query"),
  getMyApplicationsController
);

// Get single application details for the authenticated user
router.get(
  "/my-applications/:id",
  authenticateToken,
  getApplicationDetailsController
);

// Cancel an application (only if pending)
router.delete(
  "/my-applications/:id",
  authenticateToken,
  cancelApplicationController
);

// ======================
// Admin Routes
// ======================

// Get all applications across all jobs
router.get(
  "/admin/all",
  authenticateToken,
  checkRole(["admin"]),
  validate(getApplicationsQuerySchema, "query"),
  getAllApplicationsController
);

// Get all applications for a specific job
router.get(
  "/admin/job/:jobId",
  authenticateToken,
  checkRole(["admin"]),
  validate(getApplicationsQuerySchema, "query"),
  getJobApplicationsController
);

// Update application status (pending → accepted/rejected)
router.patch(
  "/admin/:id/status",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateApplicationStatusSchema),
  updateApplicationStatusController
);

export { router as JobApplicationRouter };
