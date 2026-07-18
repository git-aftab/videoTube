import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import type { Tweet } from "../types";

const fetchTweets = async (): Promise<Tweet[]> => {
  const res = await api.get("/tweet");
  return res.data.data ?? [];
};

const fetchUserTweets = async (userId: string): Promise<Tweet[]> => {
  const res = await api.get(`/tweet/${userId}`);
  return res.data.data ?? [];
};

export const useTweets = () => {
  return useQuery({
    queryKey: ["tweets"],
    queryFn: fetchTweets,
  });
};

export const useUserTweets = (userId?: string) => {
  return useQuery({
    queryKey: ["tweets", "user", userId],
    queryFn: () => fetchUserTweets(userId!),
    enabled: !!userId,
  });
};

export const useCreateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      const res = await api.post("/tweet", { content });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useUpdateTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      tweetId,
      content,
    }: {
      tweetId: string;
      content: string;
    }) => {
      const res = await api.patch(`/tweet/${tweetId}`, { content });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};

export const useDeleteTweet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tweetId: string) => {
      const res = await api.delete(`/tweet/${tweetId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tweets"] });
    },
  });
};
