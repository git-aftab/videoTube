import { Queue } from "bullmq";
import redis from "../config/redis";

const emailQueue = new Queue("emailQueue", {
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

// Helper func() to add specific jobs
const addVerificationEmailJob = async (email, username, verificationUrl) => {
  await emailQueue.add("sendVerificationEmail", {
    email,
    username,
    verificationUrl,
  });
};

const addForgotPasswordEmailJob = async (email, username, resetUrl) => {
  await emailQueue.add("sendForgotPasswordEmail", {
    email,
    username,
    resetUrl,
  });
};

export { emailQueue, addVerificationEmailJob, addForgotPasswordEmailJob };
