import { CHUNK_OVERLAP, CHUNK_SIZE } from "../../constants/Rag.constants";

const approximateTokens = (text) => {
  return Math.ceil(text.length / 4);
};

const cleanTranscript = (text) => {
  return text
    .replace(/\[.*?\]/g, "") // remove [Music]
    .replace(/\s+/g, " ") // normalize spaces
    .trim();
};

export const chunkText = (text, sectionName = "transcript") => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const cleanedText = cleanTranscript(text);

  const chunks = [];

  const words = cleanedText.split(" ");

  const maxWords = CHUNK_SIZE;

  const overlapWords = CHUNK_OVERLAP;

  let start = 0;

  let chunkIndex = 0;

  while (start < words.length) {
    const end = Math.min(start + maxWords, words.length);

    const content = words.slice(start, end).join(" ").trim();

    if (content.length > 0) {
      chunks.push({
        chunkIndex,
        section: sectionName,
        content,
      });

      chunkIndex++;
    }

    // overlap logic
    start = end - overlapWords;

    // safety check
    if (start < 0 || start >= end) {
      break;
    }
  }

  return chunks;
};