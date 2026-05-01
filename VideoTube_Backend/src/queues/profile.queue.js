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
  avatarLocalPath,
  coverImgLocalPath,
  userId,
}) => {
  await profileQueue.add("uploadAvatar", {
    avatar: avatarLocalPath || null,
    coverImage: coverImgLocalPath || null,
    userId,
  });
};

export { profileQueue, addAvatarUploadJob };
