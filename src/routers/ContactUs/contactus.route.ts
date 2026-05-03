import express from "express";
import {
  createContactUsController,
  getAllContactUsController,
  getContactUsByIdController,
} from "../../controllers/ContactUs/contactus.controller.js";
import { createContactUsSchemaValidation } from "../../validations/ContactUs/contactus.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";

const router = express.Router();

// ======================
// Admin Routes
// ======================

// Get All Contact Us
router.get(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  getAllContactUsController,
);

// Get One Contact Us By Id
router.get(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  getContactUsByIdController,
);

// ======================
// User Routes
// ======================

// Create Contact Us
router.post(
  "/",
  validate(createContactUsSchemaValidation),
  createContactUsController,
);

export { router as ContactUsRouter };
