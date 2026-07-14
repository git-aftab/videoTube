import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
import type { ApiResponse, Video } from "../types";

const fetchVideoById = async (videoId: string): Promise<Video> => {
  const res = await api.get<ApiResponse<Video>>(`/videos/${videoId}`);

  if (!res.data.data) {
    throw new Error("Video not found");
  }

  return res.data.data;
};

export const useVideoById = (videoId?: string) => {
  return useQuery({
    queryKey: ["video-by-id", videoId],
    queryFn: () => fetchVideoById(videoId!),
    enabled: !!videoId,
    staleTime: 0, //always refetch on mount
    gcTime: 0, //don't keep in cache after unmount
  });
};
