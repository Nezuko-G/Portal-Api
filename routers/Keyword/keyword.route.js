import express from "express";
import {
  createKeywordSchema,
  updateKeywordSchema,
} from "../../validations/Keyword/keyword.validate.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { checkRole } from "../../middlewares/check_roles.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import {
  createKeywordController,
  deleteKeywordController,
  getAllKeywordsController,
  getKeywordByIdController,
  updateKeywordController,
} from "../../controllers/Keyword/Keyword.controller.js";

const router = express.Router();
router.get("/", getAllKeywordsController);
router.get("/:id", getKeywordByIdController);
router.post(
  "/",
  authenticateToken,
  checkRole(["admin"]),
  validate(createKeywordSchema),
  createKeywordController
);
router.put(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  validate(updateKeywordSchema),
  updateKeywordController
);
router.delete(
  "/:id",
  authenticateToken,
  checkRole(["admin"]),
  deleteKeywordController
);

export { router as keywordRouter };
