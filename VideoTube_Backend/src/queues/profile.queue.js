import { Queue } from "bullmq";
import redis from "../config/redis.js";

const profileQueue = new Queue("profileQueue", {
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

const addAvatarUploadJob = async ({
  absoludetAvatarPath,
  absoluteCoverImagePath,
  userId,
}) => {
  await profileQueue.add("uploadAvatar", {
    avatar: absoludetAvatarPath,
    coverImage: absoluteCoverImagePath,
    userId,
  });
  console.log("Added profile upload job to queue for user:", userId);
  console.log("absoludetAvatarPath passed to worker:", absoludetAvatarPath);
  console.log("absoluteCoverImagePath passed to worker:", absoluteCoverImagePath);
};

export { profileQueue, addAvatarUploadJob };
