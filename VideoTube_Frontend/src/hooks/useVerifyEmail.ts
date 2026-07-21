import { useQuery } from "@tanstack/react-query";
import api from "../services/axios";
import type { ApiResponse } from "@/types";

const verifyEmail = async (verificationToken: string ) => {
  const res = await api.get(`/verify-email/:${verificationToken}`);
  console.log(res.data.data);
  return res.data.data;
};

export const useVerifyEmail = ({verificationToken}: {verificationToken:string}) =>{
    return useQuery({
        queryKey: ["verify-email", verificationToken],
        queryFn: ()=> verifyEmail(verificationToken),
        enabled: !!verificationToken,
        retry: false
    })
}