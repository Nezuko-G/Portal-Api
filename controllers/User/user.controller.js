import { NotFoundError, BadRequestError } from "../../Errors/error.js";
import User from "../../models/User/user.model.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";
import path from "path";

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

export const UpdateUserAvatarController = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!req.file) {
      throw new BadRequestError(res._t("user.no_image_uploaded"));
    }

    // Validate image type - allow only PNG and JPG
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      throw new BadRequestError(res._t("user.invalid_image_type"));
    }

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
          },
          (error, result) => (error ? reject(error) : resolve(result))
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    await User.findByIdAndUpdate(userId, {
      avatar: result.secure_url,
    });

    return res.status(200).json({
      message: res._t("user.avatar_updated"),
      avatar: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateUserCvController = async (req, res, next) => {
  const userId = req.user._id;

  try {
    if (!req.file) {
      throw new BadRequestError(res._t("user.no_file_uploaded"));
    }

    // Validate file type - allow only PDF
    if (req.file.mimetype !== "application/pdf") {
      throw new BadRequestError(res._t("user.invalid_file_type"));
    }

    console.log("Uploading CV:", {
      userId,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
    });

    // Upload to Cloudinary using buffer from multer
    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "cvs",
            public_id: `cv_${userId}`,
            resource_type: "raw",
            format: "pdf",
            type: "upload",
            access_mode: "public",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary error:", error);
              return reject(error);
            }
            console.log("Upload successful:", result.secure_url);
            resolve(result);
          }
        );

        // Pipe the buffer to cloudinary
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    // Update user with CV URL
    await User.findByIdAndUpdate(userId, {
      cv: result.secure_url,
    });

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
