import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";
import { resolve } from "dns";
import { rejects } from "assert";

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractAudioFromVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(videoPath)) {
        return reject(new Error("Video file not found"));
      }
      const outputAudioPath = videoPath.replace(
        path.extname(videoPath),
        ".mp3",
      );
      ffmpeg(videoPath)
        .noVideo()
        .audioCodec("libmp3lame")
        .format("mp3")
        .on("start", (commandLine) => {
          console.log("\n FFmpeg Started");
          console.log(commandLine);
        })
        .on("progress", (progress) => {
          console.log(`Processing: ${Math.floor(progress.percent) || 0}% done`);
        })
        .on("end", () => {
          console.log("Audio Extraction Completed");
          console.log("Audio Saved at:", outputAudioPath);
          resolve(outputAudioPath);
        })
        .on("error", (err) => {
          console.error("FFmpeg Error:", err.message);
          reject(err);
        })
        .save(outputAudioPath);
    } catch (error) {
      reject(error);
    }
  });
};
