import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";

const uploadVideo = async(formData: FormData) =>{
    const response = await api.post('/videos', formData, {
        headers: {'Content-Type': 'Multipart/formData'},
    })
    return response.data.data
}


export const useUploadVideo = () =>{
    return useMutation({
        mutationFn: uploadVideo
    })
}