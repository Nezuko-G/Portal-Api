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
  toggleJobActivationController
} from "../../controllers/Job/job.controller.js";
import {
  createJobSchema,
  updateJobSchema,
} from "../../validations/Job/job.validation.js";

const router = Router();

// Admin Routes
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createJobSchema),
  createJobController
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteJobController
);

router.patch(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateJobSchema),
  updateJobController
);

router.patch(
  "/toggle-activation/:id",
  authenticateToken,
  checkRole(["admin"]),
  toggleJobActivationController
);

// User Routes
router.get("/", getAllJobsController);
router.get("/:id", getOneJobController);

export { router as JobRouter };
