import { Router } from "express";
import {
  GetUserProfileController,
  UpdateUserAvatarController,
  UpdateUserCvController,
} from "../../controllers/User/user.controller.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import upload from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateToken);
router.patch("/avatar", upload.single("image"), UpdateUserAvatarController);
router.patch("/cv", upload.single("cv"), UpdateUserCvController);
router.get("/me", GetUserProfileController);

export { router as UserRouter };
