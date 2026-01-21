import { NotFoundError, BadRequestError } from "../../utils/error.js";
import User from "../../models/User/user.model.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

// Get the logged-in user's profile
export const GetUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new NotFoundError(res._t("job_application.user_not_found"));
    }

    res.status(200).json({
      message: res._t("user.profile_fetched"),
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to upload file to Cloudinary
const uploadToCloudinary = (buffer, folder, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Update user's avatar
export const UpdateUserAvatarController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      throw new BadRequestError(res._t("user.no_image_uploaded"));
    }

    // Allow only PNG/JPG images
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      throw new BadRequestError(res._t("user.invalid_image_type"));
    }

    const result = await uploadToCloudinary(req.file.buffer, "avatars", {
      resource_type: "image",
    });

    await User.findByIdAndUpdate(userId, { avatar: result.secure_url });

    res.status(200).json({
      message: res._t("user.avatar_updated"),
      avatar: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

// Update user's CV
export const UpdateUserCvController = async (req, res, next) => {
  try {
    const userId = req.user._id;

    if (!req.file) {
      throw new BadRequestError(res._t("user.no_file_uploaded"));
    }

    // Allow only PDF files
    if (req.file.mimetype !== "application/pdf") {
      throw new BadRequestError(res._t("user.invalid_file_type"));
    }

    const result = await uploadToCloudinary(req.file.buffer, "cvs", {
      public_id: `cv_${userId}`,
      resource_type: "raw",
      format: "pdf",
      type: "upload",
      access_mode: "public",
    });

    await User.findByIdAndUpdate(userId, { cv: result.secure_url });

    res.status(200).json({
      message: res._t("user.cv_updated"),
      cv: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("CV upload error:", error);
    next(error);
  }
};
