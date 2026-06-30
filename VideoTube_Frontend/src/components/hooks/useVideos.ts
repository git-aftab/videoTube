import { useQuery } from "@tanstack/react-query";
import api from "@/services/axios";
import type { Video, PaginatedResponse, ApiResponse } from "@/types";


const fetchVideo = async (page: number, search:number):Promise<PaginatedResponse <Video>> =>{
    const res = api.get<ApiResponse<PaginatedResponse<Video>>>(`/videos`, {
        params:{
        }
    })
}