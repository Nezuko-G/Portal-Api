import express from "express";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createKeywordController,
  deleteKeywordController,
  getAllKeywordsController,
  getKeywordByIdController,
  updateKeywordController,
} from "../../controllers/Keyword/keyword.controller.js";
import { createKeywordSchema, updateKeywordSchema } from "../../validations/Keyword/keyword.validate.js";

const router = express.Router();

// ======================
// User Routes
// ======================

// Get all keywords
router.get("/", getAllKeywordsController);

// Get a single keyword by ID
router.get("/:id", getKeywordByIdController);

// ======================
// Admin Routes
// ======================

// Create a new keyword
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createKeywordSchema),
  createKeywordController
);

// Update an existing keyword
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateKeywordSchema),
  updateKeywordController
);

// Delete a keyword
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteKeywordController
);

export { router as keywordRouter };
