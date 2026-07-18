import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import type { Video } from "../types";

export const useToggleSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (channelId: string) => {
      const res = await api.post(`/subscribe/${channelId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["video-by-id"] });
    },
  });
};

export const useToggleCommentLike = () => {
  return useMutation({
    mutationFn: async (commentId: string) => {
      const res = await api.post(`/like/comment-like/${commentId}`);
      return res.data.data;
    },
  });
};

export const useToggleTweetLike = () => {
  return useMutation({
    mutationFn: async (tweetId: string) => {
      const res = await api.post(`/like/tweet-like/${tweetId}`);
      return res.data.data;
    },
  });
};

export const useLikedVideos = () => {
  return useQuery({
    queryKey: ["liked-videos"],
    queryFn: async (): Promise<Video[]> => {
      const res = await api.get("/like/get-liked-videos");
      return (res.data.data ?? [])
        .map((item: { video?: Video }) => item.video)
        .filter(Boolean);
    },
  });
};

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ["healthcheck"],
    queryFn: async () => {
      const res = await api.get("/healthcheck");
      return res.data;
    },
    refetchOnWindowFocus: false,
  });
};
