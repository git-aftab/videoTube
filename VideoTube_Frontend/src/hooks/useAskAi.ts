import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";

interface AskAiPayload {
  videoId: string;
  question: string;
}

interface AskAiResponse {
  answer: string;
  sources: string[];
}

const AskAi = async ({
  videoId,
  question,
}: AskAiPayload): Promise<AskAiResponse> => {
  const res = await api.post(`/${videoId}/ai`, { question });
  return res.data.data;
};

export const useAskAi = () => {
  return useMutation({
    mutationFn: AskAi,
  });
};
