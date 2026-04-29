import { Worker } from "bullmq";
import redis from "../config/redis.js";

import {
  sendEmail,
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
} from "../utils/mail.js";

const emailWorker = new Worker(
  "emailQueue",
  async (job) => {
    const { name, data } = job;
    if (name === "sendVerificationEmail") {
      await sendEmail({
        email: data.email,
        subject: "Please Verify your email",
        mailgenContent: emailVerificationMailgenContent(
          data.username,
          data.verificationUrl,
        ),
      });
    }
    if (name === "sendForgotPasswordEmail") {
      await sendEmail({
        email: data.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
          data.username,
          data.resetUrl,
        ),
      });
    }
  },
  { connection: redis },
);

emailWorker.on("completed", (job) => {
  console.log(`Email job ${job.id} completed`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`Email job ${job.id} failed:`, err.message);
});

export default emailWorker;
