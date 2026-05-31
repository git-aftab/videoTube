import Groq from "groq-sdk";
import { CHAT_MODEL } from "../../constants/Rag.constants.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const callVideoLLM = async (context, question) => {
  const completions = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "assistant",
        content:
          "You are an AI assistant of video a platform 'VideoTube' answering questions about a video. Use only provided context and if the answer is not available in the provided context/transcript then say 'I couldn't find any relevent info in the video",
      },
      {
        role: "user",
        content: `'
        transcript: 
        ${context}
        
        question:
        ${question}`,
      },
    ],
  });

  return completions.choices[0].message.content;
};

export const callCommentLLM = () => {
  // To Be Done Later
};
