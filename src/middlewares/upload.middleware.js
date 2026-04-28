import multer from "multer";

const storage = multer.memoryStorage();

// File filter for CV uploads (PDF only)
const cvFileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

// File filter for avatar/image uploads (PNG, JPG only)
const imageFileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PNG or JPG images are allowed"), false);
  }
};

// Middleware for CV uploads
export const uploadCv = multer({ storage, fileFilter: cvFileFilter });

// Middleware for image/avatar uploads
export const uploadImage = multer({ storage, fileFilter: imageFileFilter });

// Default export for backward compatibility (CV upload)
export default uploadCv;
