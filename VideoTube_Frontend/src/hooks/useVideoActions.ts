import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";

export const useUpdateVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      videoId,
      title,
      description,
    }: {
      videoId: string;
      title: string;
      description: string;
    }) => {
      const res = await api.patch(`/videos/${videoId}`, {
        title,
        description,
      });
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["video-by-id", variables.videoId] });
      queryClient.invalidateQueries({ queryKey: ["user-videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

export const useDeleteVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const res = await api.delete(`/videos/${videoId}`);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};

export const useTogglePublishVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (videoId: string) => {
      const res = await api.patch(`/videos/${videoId}/toggle-publish`);
      return res.data.data;
    },
    onSuccess: (_, videoId) => {
      queryClient.invalidateQueries({ queryKey: ["video-by-id", videoId] });
      queryClient.invalidateQueries({ queryKey: ["user-videos"] });
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    },
  });
};
