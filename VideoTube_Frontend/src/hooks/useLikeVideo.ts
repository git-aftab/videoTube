import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";

const LikeVideo = async(videoId:string)=>{
    const res = await api.post(`/like-videos/${videoId}`)
    return res.data.data;
}

const useLikeVideo = (videoId:string) =>{
    return useMutation({
        mutationFn: LikeVideo
    })
}