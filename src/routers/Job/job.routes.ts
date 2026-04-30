import { Router } from "express";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createJobController,
  updateJobController,
  getAllJobsController,
  getOneJobController,
  deleteJobController,
  toggleJobActivationController,
} from "../../controllers/Job/job.controller.js";
import { createJobSchema, updateJobSchema } from "../../validations/Job/job.validation.js";

const router = Router();

// ======================
// Admin Routes
// ======================

// Create a new job
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createJobSchema),
  createJobController
);

// Update an existing job
router.patch(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateJobSchema),
  updateJobController
);

// Delete a job
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteJobController
);

// Toggle job activation 
router.patch(
  "/toggle-activation/:id",
  authenticateToken,
  checkRole(["admin"]),
  toggleJobActivationController
);

// ======================
// User Routes
// ======================

// Get all jobs (
router.get("/", getAllJobsController);

// Get single job details
router.get("/:id", getOneJobController);

export { router as JobRouter };
