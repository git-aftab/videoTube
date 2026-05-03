import connectDB from "../db/index.js";
import "dotenv/config"; // or however you load dotenv
await connectDB();

import "./email.worker.js";
import "./profile.worker.js";
import "./video.worker.js";

console.log("Workers initialized");
