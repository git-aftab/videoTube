import { QdrantClient } from "@qdrant/js-client-rest";

export const qdrant = new QdrantClient({
  url: process.env.QDRANT_CLUSTER_END_POINT,
  apiKey: process.env.QDRANT_API_KEY,
});
