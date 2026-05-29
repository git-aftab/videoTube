import connectDB from "../db/index.js";
import "dotenv/config";
await connectDB();
console.log("initialized the video Worker");

import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { embeddingQueue } from "../queues/embedding.queue.js";
import {
  extractAudioFromVideo,
  hasAudioStream,
} from "../services/transcription/audioExtract.service.js";
import {
  uploadImageToCloudinary,
  uploadVideoToCloudinary,
  safeUnlink,
} from "../utils/cloudinary.js";
import { Video } from "../models/video.models.js";
import path from "path";
import { transcribeAudio } from "../services/transcription/transcribeVideo.service.js";

const videoWorker = new Worker(
  "videoQueue",
  async (job) => {
    console.log("Received video job:", job.id, "with data:", job.data);
    const { name, data } = job;
    if (name !== "uploadVideo") return;

    const { videoPath, thumbnailPath, videoId } = data;
    console.log("🎬 Processing video job:", videoId);

    const uploadedVideo = await uploadVideoToCloudinary(
      path.resolve(videoPath),
    );
    if (!uploadedVideo) throw new Error("Video Upload failed");

    let thumbnailUrl = "";
    if (thumbnailPath) {
      const uploadedThumb = await uploadImageToCloudinary(
        path.resolve(thumbnailPath),
      );
      thumbnailUrl = uploadedThumb?.secure_url || "";
    }

    await Video.findByIdAndUpdate(videoId, {
      $set: {
        videoFile: uploadedVideo.secure_url,
        thumbnail: thumbnailUrl,
        duration: uploadedVideo.duration || 0,
        isPublished: true,
        processingStatus: "READY",
      },
    });
    console.log("Video uploaded and DB updated:", videoId);

    try {
      const audioExists = await hasAudioStream(path.resolve(videoPath));
      if (!audioExists) {
        console.log("No audio stream found - skipping:", videoId);
        safeUnlink(path.resolve(videoPath));
        if (thumbnailPath) safeUnlink(path.resolve(thumbnailPath));
        return;
      }

      const extractedAudioPath = await extractAudioFromVideo(
        path.resolve(videoPath),
      );

      if (extractedAudioPath) {
        await Video.findByIdAndUpdate(videoId, {
          $set: { transcriptionStatus: "PROCESSING" },
        });

        const transcriptionResult = await transcribeAudio(
          path.resolve(extractedAudioPath),
        );

        await Video.findByIdAndUpdate(videoId, {
          $set: {
            transcript: transcriptionResult.text,
            detectedLanguage: transcriptionResult.language,
            transcriptionSegments: transcriptionResult.segments,
            transcriptionStatus: "COMPLETED",
            audioFile: "",
          },
        });

        console.log("Segments count:", transcriptionResult.segments?.length);
        console.log(
          "Segments size (bytes):",
          JSON.stringify(transcriptionResult.segments).length,
        );
        transcriptionResult.segments = null; // free memory

        console.log(
          `Transcription done for ${videoId} | Language: ${transcriptionResult.language} | Length: ${transcriptionResult.text.length} Chars`,
        );

        safeUnlink(extractedAudioPath);

        // ✅ Hand off to embedding worker
        await embeddingQueue.add("generateEmbeddings", { videoId });
        console.log("Handed off to embedding queue:", videoId);
      }
    } catch (error) {
      console.error("Something went wrong:", error.message);
      await Video.findByIdAndUpdate(videoId, {
        $set: {
          transcriptionStatus: "FAILED",
          AudioProcessingError: error.message, // ✅ correct variable name
        },
      });
    }

    safeUnlink(videoPath);
    if (thumbnailPath) safeUnlink(thumbnailPath);

    console.log("Video Job completed", videoId);
  },
  { connection: redis },
);

videoWorker.on("completed", (job) =>
  console.log(`Video job ${job.id} completed`),
);
videoWorker.on("failed", (job, err) =>
  console.log(`Video job ${job.id} failed`, err.message),
);

export default videoWorker;
