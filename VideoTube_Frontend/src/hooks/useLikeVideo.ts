import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";

const LikeVideo = async (videoId: string) => {
  const res = await api.post(`/like-videos/${videoId}`);
  return res.data.data;
};

export const useLikeVideo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LikeVideo,

    onSuccess: () => {
      //Refetch the current video and verify
      queryClient.invalidateQueries({
        queryKey: ["video-by-id"],
      });
    },
  });
};
