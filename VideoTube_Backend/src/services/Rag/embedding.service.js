import axios from "axios";
import {
  EMBEDDING_MODEL,
  EMBDDING_DIMENSION,
} from "../../constants/Rag.constants.js";

export const generateEmbedding = async (text, task = "retrieval.passage") => {
  try {
    const res = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        model: EMBEDDING_MODEL,
        task,
        normalized: true,
        input: [text],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Embedding received, dim:", res.data.data[0].embedding.length);
    return res.data.data[0].embedding;
  } catch (error) {
    console.error(
      "Embedding generation failed",
      error.res?.data || error.message,
    );
    throw error;
  }
};
