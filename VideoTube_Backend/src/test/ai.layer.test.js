import { generateEmbedding } from "../services/Rag/embedding.service.js"
import { qdrant } from "../db/qdrant.js";
import {callVideoLLM} from "../services/Rag/llm.service.js"
import {searchVideoEmbd} from "../services/Rag/qdrant.service.js"

export const askVideo = async ({ videoId, question }) => {
  try {
    // 1. Generate query embedding
    const queryEmbedding = await generateEmbedding(question, "retrieval.query");

    // 2. Search Qdrant
    const results = await searchVideoEmbd(queryEmbedding, videoId)
    console.log("results:", results);

    // 3. Build context
    const context = results.points
      .map((point) => point.payload.chunkText)
      .join("\n\n");

    // 4. Build prompt
    const response = await callVideoLLM(context, question)
    console.log(response)

    return response;
  } catch (error) {
    console.error("RAG query failed:", error);
    throw error;
  }
};

const response = await askVideo({
  videoId: "6a1aa418d46f35cd8a786437",
  // question: "Why do people fail to follow development roadmaps?",
  question: "Hey can you summarise the video for me"
});

console.log(response.answer);
console.log(response.sources);
