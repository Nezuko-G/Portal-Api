import express from "express";
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
import { validate } from "../../middlewares/validate.middleware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";

const router = express.Router();

router.get("/", getAllFAQController);
router.get("/:id", getFAQByIdController);
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createFAQSchemaValidation),
  createFAQController
);
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateFAQSchema),
  updateFAQController
);
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteFAQController
);

export { router as FAQRouter };