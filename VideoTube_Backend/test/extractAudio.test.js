import { extractAudioFromVideo } from "../src/services/transcription/audioExtract.service.js";

export const testAudioExtraction = async (req, res) => {
  try {
    const videoPath = req.file.path;
    const audioPath = await extractAudioFromVideo(videoPath);

    return res.status(200).json({
      success: true,
      videoPath,
      audioPath,
      message: "Audio Extraction successfull"
    });
    
  } catch (error) {
    console.error(error)

    return res.status(500).json({
        success: false,
        message: error.message
    })
  }
};
