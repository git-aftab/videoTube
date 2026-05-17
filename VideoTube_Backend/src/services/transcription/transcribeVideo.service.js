import Groq from "groq-sdk";
import fs from "fs";
import path from "path";
import { text } from "stream/consumers";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const transcribeAudio = async (audioFilePath) => {
  try {
    if (!audioFilePath || fs.existsSync(audioFilePath)) {
      throw new Error(`Audio file not found: ${audioFilePath}`);
    }

    const stats = fs.statSync(audioFilePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    console.log(`Audio file size : ${fileSizeInMB.toFixed(2)}MB`);

    if (fileSizeInMB > 25) {
      throw new Error("Audio file too large, max allowed is 25MB");
    }

    const transcription = await groq.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: "whisper-large-v3", // best accuracy
      response_format: "verbose_json", //gives us language + segments
      temperature: 0, //deterministic output
    });

    console.log("Transcription complete");
    console.log("Detected Language:", transcription.language);

    return {
      text: transcription.text,
      language: transcription.language,
      segments: transcription.segments || [],
      duration: transcription.duration,
    };
  } catch (error) {
    console.log("Transcription error:", error.message);
  }
};
