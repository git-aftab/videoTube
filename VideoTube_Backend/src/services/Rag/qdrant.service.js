import { qdrant } from "../../db/qdrant.js";
import crypto from "crypto";

export const storeEmbeddings = async ({
  videoId,
  chunkText,
  embedding,
  chunkIndex,
}) => {
  try {
    await qdrant.upsert("video-transcripts", {
      wait: true,
      points: [
        {
          id: crypto.randomUUID(),
          vector: embedding,

          payload: {
            videoId,
            chunkText,
            chunkIndex,
          },
        },
      ],
    });

    console.log(`Stored chunk ${chunkIndex} in Qdrant`);
  } catch (error) {
    console.error("Qdrand store failed:", error.message);
    throw error;
  }
};
