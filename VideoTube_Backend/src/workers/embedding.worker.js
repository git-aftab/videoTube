// Add at the top of both video.worker.js and embedding.worker.js
import connectDB from "../db/index.js";
import "dotenv/config";
await connectDB();

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

const embeddingWroker = new Worker(
  "embeddingQueue",
  async (job) => {
    console.log("Recieved the embedding work:", job.id);
    const { name, data } = job;
    if (name !== "generateEmbeddings") return;
    const { videoId } = job.data;

    const videoTranscript = await Video.findById(videoId).select("transcript");

    if (!videoTranscript) {
      throw new Error("Transcript not found for video");
    }

    const cleanedText = cleanTranscript(videoTranscript.transcript);
    const chunks = chunkText(cleanedText);
    console.log("Total chunks:", chunks.length);

    for (const chunk of chunks) {
      console.log("Embeding chunk:", chunk.chunkIndex);

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
    console.log("Embedding Job done for:", videoId);
  },
  { connection: redis },
);

embeddingWorker.on("completed", (job) =>
  console.log("Embedding job completed:", job.id),
);
embeddingWorker.on("failed", (job, err) =>
  console.error("Embedding job failed:", job.id, err.message),
);

export default embeddingWorker;