import { Router } from "express";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCountryController,
  updateCountryController,
  deleteCountryController,
  getOneCountryController,
  getAllCountriesController,
} from "../../controllers/Country/country.controller.js";
import {
  createCountrySchema,
  updateCountrySchema,
} from "../../validations/Country/country.validation.js";

const router = Router();

// Admin Routes
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createCountrySchema),
  createCountryController,
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteCountryController,
);

router.patch(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateCountrySchema),
  updateCountryController,
);

// User Routes
router.get("/", getAllCountriesController);
router.get("/:id", getOneCountryController);

export { router as CountryRouter };
