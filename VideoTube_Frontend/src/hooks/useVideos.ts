import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
import type { Video, PaginatedResponse, ApiResponse } from "@/types";

const fetchVideo = async (params: {
  page: number;
  search?: string;
  sortBy?: string;
  sortType?: string;
}): Promise<PaginatedResponse<Video>> => {
  const res = await api.get<ApiResponse<PaginatedResponse<Video>>>(`/videos`, {
    params: {
      page: params.page,
      limit: 12,
      query: params.search,
      sortBy: params.sortBy || "createdAt",
      sortType: params.sortType || "desc",
    },
  });

  return res.data.data;
};

export const useVideos = (params: {
    page: number
    search?:string
    sortBy?:string
    sortType?: string
}) =>{
    return useQuery({
        queryKey: ['videos', params],
        queryFn: () =>fetchVideo(params)
    })
}
