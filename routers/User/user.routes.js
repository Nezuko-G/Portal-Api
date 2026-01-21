import { Router } from "express";
import {
  GetUserProfileController,
  UpdateUserAvatarController,
  UpdateUserCvController,
} from "../../controllers/User/user.controller.js";
import { authenticateToken } from "../../middlewares/authenticate_token.middlware.js";
import { uploadImage, uploadCv } from "../../middlewares/upload.middleware.js";

const router = Router();

router.use(authenticateToken);

// Get current user's profile
router.get("/me", GetUserProfileController);

// Update user avatar
router.patch("/avatar", uploadImage.single("image"), UpdateUserAvatarController);

// Update user CV (PDF)
router.patch("/cv", uploadCv.single("cv"), UpdateUserCvController);

export { router as UserRouter };
