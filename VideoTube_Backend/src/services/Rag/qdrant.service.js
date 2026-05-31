import { match } from "assert";
import { qdrant } from "../../db/qdrant.js";
import crypto from "crypto";

await qdrant.createPayloadIndex("video-transcripts", {
  field_name: "videoId",
  field_schema: "keyword",
});

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

export const searchVideoEmbd = async (queryEmbedding, videoId) => {
  const results = await qdrant.query("video-transcripts", {
    query: queryEmbedding,
    filter: {
      must: [
        {
          key: "videoId",
          match: {
            value: videoId,
          },
        },
      ],
    },
    limit: 3,
    with_payload: true,
  });

  return results;
};
