import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // pdf and word only
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || // .docx
    file.mimetype === "application/msword" // .doc
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF or Word files are allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
