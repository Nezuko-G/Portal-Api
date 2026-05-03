import { Request, Response, NextFunction } from "express";
import { NotFoundError, BadRequestError } from "../../utils/error.js";
import User from "../../models/User/user.model.js";
import cloudinary from "../../config/cloudinary.js";
import streamifier from "streamifier";

// Get the logged-in user's profile
export const GetUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new NotFoundError(
        (res as any)._t("job_application.user_not_found"),
      );
    }

    res.status(200).json({
      message: (res as any)._t("user.profile_fetched"),
      user,
    });
  } catch (error) {
    next(error);
  }
};

// Helper to upload file to Cloudinary
const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  options: any = {},
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, ...options },
      (error: any, result: any) => {
        // If there's a result and a public_id, the upload was successful
        // even if there's a non-critical error (like a preview error for PDFs).
        if (result && result.public_id) {
          return resolve(result);
        }
        // If there's a legitimate error from the callback or in the result object
        if (error) {
          return reject(error);
        }
        if (result?.error) {
          return reject(
            new Error(result.error.message || "Cloudinary upload failed"),
          );
        }
        // Fallback for unexpected cases
        reject(new Error("Unknown Cloudinary error"));
      },
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Update user's avatar
export const UpdateUserAvatarController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    if (!req.file) {
      throw new BadRequestError((res as any)._t("user.no_image_uploaded"));
    }

    // Allow only PNG/JPG images
    const allowedImageTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!allowedImageTypes.includes(req.file.mimetype)) {
      throw new BadRequestError((res as any)._t("user.invalid_image_type"));
    }

    const result = await uploadToCloudinary(req.file.buffer, "avatars", {
      resource_type: "image",
    });

    await User.findByIdAndUpdate(userId, { avatar: result.secure_url });

    res.status(200).json({
      message: (res as any)._t("user.avatar_updated"),
      avatar: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

// Update user's CV
export const UpdateUserCvController = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = (req as any).user._id;

    if (!req.file) {
      throw new BadRequestError((res as any)._t("user.no_file_uploaded"));
    }

    // Allow only PDF files
    if (req.file.mimetype !== "application/pdf") {
      throw new BadRequestError((res as any)._t("user.invalid_file_type"));
    }

    const result = await uploadToCloudinary(req.file.buffer, "cvs", {
      public_id: `cv_${userId}.pdf`,
      resource_type: "raw",
      type: "upload",
      access_mode: "public",
    });

    await User.findByIdAndUpdate(userId, { cv: result.secure_url });

    res.status(200).json({
      message: (res as any)._t("user.cv_updated"),
      cv: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("CV upload error:", error);
    next(error);
  }
};
