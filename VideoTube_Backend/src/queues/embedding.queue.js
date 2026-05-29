import { Queue } from "bullmq";
import redis from "../config/redis.js";

export const embeddingQueue = new Queue("embeddingQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

