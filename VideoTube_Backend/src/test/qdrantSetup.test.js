import { qdrant } from "../db/qdrant.js";

const setupQdrant = async () => {
  try {
    await qdrant.createCollection("video-transcripts", {
      vectors: {
        size: 1024,
        distance: "Cosine",
      },
    });

    console.log("✅ Qdrant collection created successfully");
  } catch (error) {
    console.error("❌ Collection creation failed");

    console.error(error);
  }
};

setupQdrant();
