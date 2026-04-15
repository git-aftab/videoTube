import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// safe delete
const safeUnlink = (filePath) => {
  try {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error("File delete error:", err.message);
  }
};

// IMAGE UPLOAD
export const uploadImageToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const absolutePath = path.resolve(localFilePath);

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "image",
    });

    safeUnlink(absolutePath);

    return response;
  } catch (error) {
    console.error("Image upload error:", error);
    safeUnlink(localFilePath);
    return null;
  }
};

// VIDEO UPLOAD -> stream-based 
export const uploadVideoToCloudinary = async (localFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!localFilePath) return resolve(null);

      const absolutePath = path.resolve(localFilePath);

      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video",
          timeout: 60000, // increase timeout
        },
        (error, result) => {
          safeUnlink(absolutePath);

          if (error) {
            console.error("Video upload error:", error);
            return reject(error);
          }

          resolve(result);
        },
      );

      fs.createReadStream(absolutePath).pipe(stream);
    } catch (error) {
      console.error("Stream setup error:", error);
      safeUnlink(localFilePath);
      reject(error);
    }
  });
};

// DELETE
export const deleteFromCloudinary = async (url, resourceType = "image") => {
  try {
    if (!url) return;

    const publicId = url.split("/").pop().split(".")[0];

    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Delete error:", error);
  }
};
