import { generateEmbedding } from "../Rag/embedding.service.js";
import { searchVideoEmbd } from "../Rag/qdrant.service.js";
import { callVideoLLM } from "../Rag/llm.service.js";

export const askvideoAi = async (query, videoId) => {
  try {
    if (!query || query.trim() === "") {
      console.log("Query not found.");
    }

    const queryEmbedding = await generateEmbedding(query, "retrieval.query");
    console.log("Query Embedding:", queryEmbedding.legth);

    const results = await searchVideoEmbd(queryEmbedding, videoId);
    console.log("results found:", results);

    const context = results.points
      .map((point) => point.payload.chunkText)
      .join("\n\n");

    const response = await callVideoLLM(context, query);
    console.log("Response:", response);

    return response;
    
  } catch (error) {
    console.error("RAG Query Failed:", error.message);
  }
};

export const askCommentAi = (query) => {
  //Todo : comment sentiment, overview.
};
