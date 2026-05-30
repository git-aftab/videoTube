// Add at the top of both video.worker.js and embedding.worker.js
import connectDB from "../db/index.js";
import "dotenv/config";
await connectDB();
console.log("initialized the embedding Worker");

import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { Video } from "../models/video.models.js";
import {
  chunkText,
  approximateTokens,
  cleanTranscript,
} from "../services/Rag/chunking.service.js";
import { generateEmbedding } from "../services/Rag/embedding.service.js";
import { storeEmbeddings } from "../services/Rag/qdrant.service.js";

const embeddingWorker = new Worker(
  "embeddingQueue",
  async (job) => {
    const { name } = job;
    if (name !== "generateEmbeddings") return;
    const { videoId } = job.data;

    const video = await Video.findById(videoId).select("transcript").lean();

    if (!video?.transcript) throw new Error("Transcript not found");

    const cleanedText = cleanTranscript(video.transcript);
    console.log("cleaned text:", cleanedText)
    const chunks = chunkText(cleanedText);

    for (const chunk of chunks) {
      const embedding = await generateEmbedding(
        chunk.content,
        "retrieval.passage",
      );

      await storeEmbeddings({
        videoId,
        chunkText: chunk.content,
        embedding,
        chunkIndex: chunk.chunkIndex,
      });
    }

    await Video.findByIdAndUpdate(videoId, {
      $set: { embeddingStatus: "COMPLETED" },
    });
    console.log("✅ Done");
  },
  { connection: redis, concurrency: 1 },
);

embeddingWorker.on("completed", (job) =>
  console.log("Embedding job completed:", job.id),
);
embeddingWorker.on("failed", (job, err) =>
  console.error("Embedding job failed:", job.id, err.message),
);

export default embeddingWorker;