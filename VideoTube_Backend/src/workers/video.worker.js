import { Worker } from "bullmq";
import redis from "../config/redis";
import { uploadVideoToCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";

const videoWorker = new Worker(
  "videoWorker",
  async (job) => {
    const { name, data } = job;

    if (name === "uploadVideo") {
      const { videoPath, videoId } = data;
      console.log("Processing Video upload: ", videoId);

      const uploadedVideo = await uploadVideoToCloudinary(videoPath);

      if (!uploadedVideo) {
        throw new Error("Video upload failed");
      }

      await Video.findByIdAndUpdate(videoId, {
        videoFile: uploadedVideo.secure_url,
        duration: uploadedVideo.duration,
        isPublished: true,
      });
      console.log("Video uploaded successfully", videoId);
    }
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
