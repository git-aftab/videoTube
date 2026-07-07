import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
import type { Video } from "@/types";

const fetchUserVideo = async (userId: string) => {
  const response = await api.get(`/videos/user/${userId}`);
  return response.data.data;
};

export const useUserVideos = (userId: string) => {
  return useQuery({
    queryKey: ["user-videos", userId],
    queryFn: () => fetchUserVideo(userId),
    enabled: !!userId,
  });
};
