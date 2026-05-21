import { qdrant } from "../../db/qdrant.js";

export const createVideoCollection = async () => {
  try {
    await qdrant.createCollection("video-transcripts", {
      vectors: {
        size: 1024,
        distance: "Cosine",
      },
    });

    console.log("Qdrant collection created");
  } catch (error) {
    console.log("Collection may already exists", error.message);
  }
};
