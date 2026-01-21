import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import {
  getAllExperienceLevelsController,
  getExperienceLevelByIdController,
  createExperienceLevelController,
  updateExperienceLevelController,
  deleteExperienceLevelController,
} from "../../controllers/ExperienceLevel/experiencelevel.controller.js";
import {
  createExperienceLevelSchema,
  updateExperienceLevelSchema,
} from "../../validations/ExperienceLevel/experiencelevel.validate.js";

const router = express.Router();

// ======================
// user Routes
// ======================

// Get all experience levels
router.get("/", getAllExperienceLevelsController);

// Get a single experience level by ID
router.get("/:id", getExperienceLevelByIdController);

// ======================
// Admin Routes
// ======================

// Create a new experience level
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createExperienceLevelSchema),
  createExperienceLevelController
);

// Update an experience level by ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateExperienceLevelSchema),
  updateExperienceLevelController
);

// Delete an experience level by ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteExperienceLevelController
);

export { router as ExperienceLevelRouter };
