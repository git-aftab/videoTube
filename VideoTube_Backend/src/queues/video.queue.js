import { Queue } from "bullmq";
import redis from "../config/redis";

const videoQueue = new Queue("videoQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

const addVideoUploadJob = async (videoPath, videoId) => {
  await videoQueue.add("uploadVideo", {
    videoPath,
    videoId,
  });
};

export { addVideoUploadJob, videoQueue };
