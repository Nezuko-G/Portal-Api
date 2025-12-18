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

// User Routes (authenticated users only)
router.post(
  "/apply/:jobId",
  authenticateToken,
  applyToJobController
);

router.get(
  "/my-applications",
  authenticateToken,
  validate(getApplicationsQuerySchema, "query"),
  getMyApplicationsController
);

router.get(
  "/my-applications/:id",
  authenticateToken,
  getApplicationDetailsController
);

router.delete(
  "/my-applications/:id",
  authenticateToken,
  cancelApplicationController
);

// Admin Routes
router.get(
  "/admin/all",
  authenticateToken,
  checkRole(["admin"]),
  validate(getApplicationsQuerySchema, "query"),
  getAllApplicationsController
);

router.get(
  "/admin/job/:jobId",
  authenticateToken,
  checkRole(["admin"]),
  validate(getApplicationsQuerySchema, "query"),
  getJobApplicationsController
);

router.patch(
  "/admin/:id/status",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateApplicationStatusSchema),
  updateApplicationStatusController
);

export { router as JobApplicationRouter };
