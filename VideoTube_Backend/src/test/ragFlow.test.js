import "dotenv/config";
import { chunkText, approximateTokens} from "../services/Rag/chunking.service.js";

import { generateEmbedding } from "../services/Rag/embedding.service.js";

import { storeEmbeddings } from "../services/Rag/qdrant.service.js";

import { qdrant } from "../db/qdrant.js";

const testTranscript = `
Redis is an in-memory database used for caching.
Rate limiting protects APIs from abuse.
BullMQ helps process background jobs.
Vector databases are useful for semantic search.
`;

const runTest = async () => {
  try {
    console.log("\n========== CHUNKING ==========\n");

    const chunks = chunkText(testTranscript);

    console.log("Total Chunks:", chunks.length);

    console.log(chunks);
    console.log("\n========== TOKEN APPROXIMATION ==========\n");
    const tokenCount = approximateTokens(testTranscript);
    console.log("Approximate Tokens:", tokenCount);

    console.log("\n========== EMBEDDING ==========\n");

    for (const chunk of chunks) {
      console.log(`Generating embedding for chunk ${chunk.chunkIndex}`);

      const embedding = await generateEmbedding(
        chunk.content,
        "retrieval.passage",
      );

      console.log("Embedding dimension:", embedding.length);

      console.log("\n========== QDRANT STORE ==========\n");

      await storeEmbeddings({
        videoId: "test-video-123",
        chunkText: chunk.content,
        embedding,
        chunkIndex: chunk.chunkIndex,
      });
    }

    console.log("\n========== QDRANT SEARCH ==========\n");

    const queryEmbedding = await generateEmbedding(
      "How does rate limiting work?",
      "retrieval.query",
    );

    const searchResult = await qdrant.search("video-transcripts", {
      vector: queryEmbedding,
      limit: 3,
    });

    console.log(JSON.stringify(searchResult, null, 2));

    console.log("\n✅ FULL RAG FLOW WORKING");
  } catch (error) {
    console.error("\n❌ TEST FAILED\n");

    console.error(error);
  }
};

runTest();
