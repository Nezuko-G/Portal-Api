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

// ======================
// Admin Routes
// ======================

// Create a new country
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createCountrySchema),
  createCountryController
);

// Delete a country by ID
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteCountryController
);

// Update a country by ID
router.patch(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateCountrySchema),
  updateCountryController
);

// ======================
// User Routes
// ======================

// Get all countries
router.get("/", getAllCountriesController);

// Get a single country by ID
router.get("/:id", getOneCountryController);

export { router as CountryRouter };
