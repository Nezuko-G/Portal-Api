import express from "express";
import {
  createContactUsController,
  getAllContactUsController,
  getContactUsByIdController,
} from "../../controllers/ContactUs/contactus.controller.js";
import { createContactUsSchemaValidation } from "../../validations/ContactUs/contactus.validation.js";
import { validate } from "../../middlewares/validate.middleware.js";


const router = express.Router();

router.get("/", getAllContactUsController);
router.get("/:id", getContactUsByIdController);
router.post("/", validate(createContactUsSchemaValidation), createContactUsController);

export { router as ContactUsRouter };