import express from "express";
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
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.get("/", getAllExperienceLevelsController);
router.get("/:id", getExperienceLevelByIdController);
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createExperienceLevelSchema),
  createExperienceLevelController
);
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateExperienceLevelSchema),
  updateExperienceLevelController
);
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteExperienceLevelController
);

export { router as ExperienceLevelRouter };
