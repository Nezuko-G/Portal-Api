import express from "express";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import {
  createFAQController,
  getAllFAQController,
  getFAQByIdController,
  updateFAQController,
  deleteFAQController,
} from "../../controllers/FAQ/faq.controller.js";
import {
  createFAQSchemaValidation,
  updateFAQSchema,
} from "../../validations/FAQ/faq.validation.js";

const router = express.Router();

// ======================
// User Routes
// ======================

// Get all FAQs
router.get("/", getAllFAQController);

// Get a single FAQ by ID
router.get("/:id", getFAQByIdController);

// ======================
// Admin Routes
// ======================

// Create a new FAQ
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createFAQSchemaValidation),
  createFAQController
);

// Update an existing FAQ by ID
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateFAQSchema),
  updateFAQController
);

// Delete an FAQ by ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteFAQController
);

export { router as FAQRouter };
