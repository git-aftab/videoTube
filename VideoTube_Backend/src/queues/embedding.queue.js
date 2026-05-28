import { Queue } from "bullmq";
import redis from "../config/redis";

export const embeddingQueue = new Queue("embeddingQueue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { tyep: "exponential", delay: 5000 },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

