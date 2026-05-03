import multer from "multer";
import type { Request } from "express";

const storage = multer.memoryStorage();

// File filter for CV uploads (PDF only)
const cvFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile?: boolean) => void,
): void => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"));
  }
};

// File filter for avatar/image uploads (PNG, JPG only)
const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: (error: Error | null, acceptFile?: boolean) => void,
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG or JPG images are allowed"));
  }
};

// Middleware for CV uploads
export const uploadCv = multer({ storage, fileFilter: cvFileFilter });

// Middleware for image/avatar uploads
export const uploadImage = multer({ storage, fileFilter: imageFileFilter });

// Default export for backward compatibility (CV upload)
export default uploadCv;
