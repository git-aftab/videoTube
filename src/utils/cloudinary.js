import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import "dotenv/config"

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.COULDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    console.log("Uploading to cloudinary:", localFilePath);

    const absolutePath = path.resolve(localFilePath);

    const response = await cloudinary.uploader.upload(absolutePath, {
      resource_type: "auto",
    });

    console.log("File uploaded on cloudinary. File src:" + response.url);

    // once the file is uploaded then we would like to delete it from our servers
    fs.unlinkSync(absolutePath);
    return response;

    return response;
  } catch (error) {
    console.error("cloudinary upload error", error);
    fs.unlinkSync(path.resolve(localFilePath));
    return null;
  }
};

export { uploadOnCloudinary };
