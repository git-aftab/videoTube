// Add at the top of both video.worker.js and embedding.worker.js
import connectDB from "../db/index.js";
import "dotenv/config";
await connectDB();

