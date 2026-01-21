import { Router } from "express";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import {
  createCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
  getOneCategoryController,
  updateCategoryController,
} from "../../controllers/Category/category.controller.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../../validations/Category/category.validation.js";

const router = Router();

// ======================
// Admin Routes
// ======================
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createCategorySchema),
  createCategoryController
);

router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteCategoryController
);

router.patch(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateCategorySchema),
  updateCategoryController
);

// ======================
// User Routes
// ======================
router.get("/", getAllCategoriesController);
router.get("/:id", getOneCategoryController);

export { router as CategoryRouter };
