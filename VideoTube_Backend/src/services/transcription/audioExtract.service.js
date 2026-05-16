import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import path from "path";
import fs from "fs";

export const hasAudioStream = (videoPath) => {
  return new Promise((resolve, reject) => {
    console.log("Checking Audio Availability for videoPath:",videoPath);
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.log(
          "There is something wrong with hasAudio or no audio available.",
        );
        return reject(err);
      }
      const hasAudio = metadata.streams.some(
        (stream) => stream.codec_type === "audio",
      );

      resolve(hasAudio);
      console.log("The Video Contains Audio");
    });
  });
};

ffmpeg.setFfmpegPath(ffmpegPath);

export const extractAudioFromVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    try {
      console.log("Initializing Video --> Audio");
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
