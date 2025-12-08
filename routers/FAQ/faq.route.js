import express from "express";
import {
  createFAQController,
  getAllFAQController,
  getFAQByIdController,
  updateFAQController,
  deleteFAQController,
} from "../../controllers/FAQ/faq.controller.js";
import { createFAQSchemaValidation } from "../../validations/FAQ/faq.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";


const router = express.Router();

router.get("/", getAllFAQController);
router.get("/:id", getFAQByIdController);
router.post("/", validate(createFAQSchemaValidation), createFAQController);
router.put("/:id", updateFAQController);
router.delete("/:id", deleteFAQController);

export { router as FAQRouter };