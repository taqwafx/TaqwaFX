import multer from "multer";
import path from "path";

// storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/Inv.Aggrements");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    cb(null, `temp-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

// file filter (optional but recommended)
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG, PNG files allowed"), false);
  }
};

export const uploadAgreement = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});
