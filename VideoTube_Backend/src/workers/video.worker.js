import { Worker } from "bullmq";
import redis from "../config/redis.js";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";

const videoWorker = new Worker(
  "videoWorker",
  async (job) => {
    const { name, data } = job;

    if (name !== "uploadVideo") return;

    const { videoPath, thumbnailPath, videoId } = data;

    console.log("🎬 Processing video job:", videoId);

    // upload video
    const uploadedVideo = await uploadVideoToCloudinary(videoPath);
    if (!uploadedVideo) {
      throw new Error("Video Upload failed");
    }

    // thumbnail --- OPTIONAL -> null
    let uploadedThumbnail = null;

    if (thumbnailPath) {
      uploadedThumbnail = await uploadImageToCloudinary(thumbnailPath);

      if (!uploadedThumbnail) {
        throw new Error("Thumbnail Upload failed");
      }
    }

    // update DB
    const updatedData = {
      videoFile: uploadedVideo.secure_url,
      duration: uploadedVideo.duration,
      isPublished: true,
    };

    if (uploadedThumbnail.secure_url) {
      updatedData.thumbnail = uploadedThumbnail.secure_url;
    }

    await Video.findByIdAndUpdate(videoId, updatedData);

    safeUnlink(videoPath);
    if (thumbnailPath) safeUnlink(thumbnailPath);

    console.log("Video Job completed", videoId);
  },

  { connection: redis },
);

videoWorker.on("completed", (job) => {
  console.log(`Video job ${job.id} completed`);
});

videoWorker.on("failed", (job, err) => {
  console.log(`Video job ${job.id} failed`, err.message);
});

export default videoWorker;
