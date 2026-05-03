import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { uploadImageToCloudinary, safeUnlink } from "../utils/cloudinary.js";
import { User } from "../models/user.models.js";
import fs from "fs";

const profileWorker = new Worker(
  "profileQueue",
  async (job) => {
    console.log("Profile Worker received job:", job.id, job.name);
    const { name, data } = job;

    if (name !== "uploadAvatar") return;

    const { avatar, coverImage, userId } = data;

    if (avatar && !fs.existsSync(avatar)) {
      console.error("File not found at path:", avatar);
      throw new Error(`File not found: ${avatar}`);
    }

    console.log("Received profile upload job:", { userId, avatar, coverImage });

    console.log("Processing profile upload:", userId);

    let updatedData = {};

    if (avatar) {
      const uploadedAvatar = await uploadImageToCloudinary(avatar);
      if (uploadedAvatar) {
        updatedData.avatar = uploadedAvatar.secure_url;
      }
      safeUnlink(avatar);
    }

    if (coverImage) {
      const uploadedCover = await uploadImageToCloudinary(coverImage);
      if (uploadedCover) {
        updatedData.coverImage = uploadedCover.secure_url;
      }
      safeUnlink(coverImage);
    }

    if (Object.keys(updatedData).length > 0) {
      await User.findByIdAndUpdate(userId, updatedData);
    }
    console.log("Profile upload completed:", userId);
  },
  { connection: redis },
);

profileWorker.on("completed", (job) => {
  console.log("Profile Job completed:", job.id);
});

profileWorker.on("failed", (job, err) => {
  console.error("Profile Job failed:", job?.id, err.message);
});

export default profileWorker;
