import express from "express";
import {
  createContactUsController,
  getAllContactUsController,
  getContactUsByIdController,
} from "../../controllers/ContactUs/contactus.controller.js";
import { createContactUsSchemaValidation } from "../../validations/ContactUs/contactus.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";

const router = express.Router();

router.get(
  "/",
  getAllContactUsController
);
router.get(
  "/:id",
  getContactUsByIdController
);
router.post(
  "/",
  authenticateToken,
  validate(createContactUsSchemaValidation),
  createContactUsController
);

export { router as ContactUsRouter };
