import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
import type { Video } from "../types";

// interface VidoeProps{
//     videoId:
// }

const fetchVideoById = async (videoId: string) => {
  const res = await api.get(`/videos/${videoId}`);
  console.log("videoId:", res.data.data);

  return res.data.data;
};

export const useVideoById = (videoId: string) => {
  return useQuery({
    queryKey: ["video-by-id", videoId],
    queryFn: () => fetchVideoById(videoId),
    enabled: !!videoId,
    staleTime: 0, //always refetch on mount
    gcTime: 0, //don't keep in cache after unmount
  });
};
