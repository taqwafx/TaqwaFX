import multer from "multer";
import { initCloudinary } from "../utils/cloudinary.js";

export const upload = multer({ storage: multer.memoryStorage() });

const cloudinary = initCloudinary();

const streamUpload = (buffer, folder, originalName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
        public_id: originalName,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      },
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      },
    );
    stream.end(buffer);
  });
};

export const uploadFileToCloudinary = async (
  file,
  fileName,
  folder = "TaqwaFX/Agreement",
) => {
  if(!file) return undefined;
  const res = await streamUpload(file?.buffer, folder, fileName);
  return res?.secure_url;
};
