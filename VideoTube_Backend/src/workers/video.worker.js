import { Worker } from "bullmq";
import redis from "../config/redis.js";
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

console.log("Initializing video worker...");

const videoWorker = new Worker(
  "videoQueue",
  async (job) => {
    console.log("Received video job:", job.id, "with data:", job.data);
    const { name, data } = job;

    if (name !== "uploadVideo") return;

    console.log("🎬 Starting video job:", job.id, "with data:", data);

    const { videoPath, thumbnailPath, videoId } = data;

    console.log("🎬 Processing video job:", videoId);

    // upload video
    const uploadedVideo = await uploadVideoToCloudinary(
      path.resolve(videoPath),
    );
    if (!uploadedVideo) {
      throw new Error("Video Upload failed");
    }

    // thumbnail --- OPTIONAL -> null
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

    // let extractedAudioPath = null
    try {
      console.log("Checking audio Stream...");
      const audioExists = await hasAudioStream(path.resolve(videoPath));

      if (!audioExists) {
        console.log(
          "No audio stream found - skipping extraction for: ",
          videoId,
        );
        safeUnlink(path.resolve(videoPath));
        if (thumbnailPath) safeUnlink(path.resolve(thumbnailPath));
        return;
      }

      console.log("Extracting Audio...");
      const extractedAudioPath = await extractAudioFromVideo(
        path.resolve(videoPath),
      );

      if (extractedAudioPath) {
        console.log("Starting transcription for: video:", videoId);

        await Video.findByIdAndUpdate(videoId, {
          $set: { transcriptionStatus: "PROCESSING" },
        });

        const transcriptionResult = await transcribeAudio(path.resolve(extractedAudioPath));

        await Video.findByIdAndUpdate(videoId, {
          $set: {
            transcript: transcriptionResult.text,
            detectedLanguage: transcriptionResult.language,
            transcriptionSegments: transcriptionResult.segments,
            transcriptionStatus: "COMPLETED",
            audioFile: "", // clear local path - transcript is stored in Db
          },
        });
        console.log(
          `Transcription done for ${videoId}`,
          `Language: ${transcriptionResult.language}`,
          `Length: ${transcriptionResult.text.length} Chars`,
        );
        safeUnlink(extractedAudioPath);
      }

      // if (!extractedAudioPath) {
      //   console.log("Audio Extraction failed skipping it");
      // } else {
      //   console.log("Audio extracted at:", extractedAudioPath);
      //   await Video.findByIdAndUpdate(videoId, {
      //     $set: {
      //       audioFile: extractedAudioPath,
      //     },
      //   });
      // }

    } catch (transcriptionError) {
      console.error("Transcription failed:",transcriptionError.message);

      await Video.findByIdAndUpdate(videoId,{
        $set: {
          transcriptionStatus: "FAILED",
          AudioProcessingError: transcriptionError.message
        }
      })
    }
    safeUnlink(videoPath);
    if (thumbnailPath) safeUnlink(thumbnailPath);
    // if(extractedAudioPath) safeUnlink(extractedAudioPath)

    console.log("Video Job completed", videoId);
  },

  { connection: redis },
);

videoWorker.on("completed", (job) => {
  console.log(`Video job ${job.id} completed`);
});

videoWorker.on("failed", (job, err) => {
  console.log(`Video job ${job.id} failed`, err.message);
});

export default videoWorker;
