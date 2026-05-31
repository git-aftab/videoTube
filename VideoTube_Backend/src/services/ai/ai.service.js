import { CHAT_MODEL } from "../../constants/Rag.constants.js";
import { generateEmbedding} from "../Rag/embedding.service.js";
import {searchVideoEmbd} from "../Rag/qdrant.service.js";

export const askAi = (query) => {
  if (!query || query.trim() === "") {
    console.log("Query not found.");
  }

  const queryEmbedding = generateEmbedding(query,task = "retrieval.query");
  
  console.log("Query Embedding:", queryEmbedding.legth, queryEmbedding);

  const searchQdrant = search()
};
