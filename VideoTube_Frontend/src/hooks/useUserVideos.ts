import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
// import type { Video } from "@/types";

const fetchUserVideo = async (userId: string) => {
  const response = await api.get(`/videos/user/${userId}`);
  console.log("userVides", response.data.data);
  console.log("userVides", response.data.data.videos[0]?.videos);
  
  return response.data.data.videos[0]?.videos;
};

export const useUserVideos = (userId: string) => {
  return useQuery({
    queryKey: ["user-videos", userId],
    queryFn: () => fetchUserVideo(userId),
    enabled: !!userId,
  });
};
