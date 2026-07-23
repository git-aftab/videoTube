import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../services/axios";
import type { ApiResponse } from "@/types";

const sendVerifyEmailReq = async () => {
  const res = await api.post(`/auth/resend-email-verification`);
  console.log(res.data.data);
  return res.data.data;
};

export const useVerifyEmail = () => {
  return useMutation({
    mutationKey: ["verify-email"],
    mutationFn: () => sendVerifyEmailReq(),
    retry: false,
  });
};

const verifyEmail = async (verificationToken: string) => {
  const res = await api.get(`/auth/verify-email/${verificationToken}`);
  return res.data.data;
};

export const useVerifyEmailToken = () => {
  return useMutation({
    mutationKey: ["verify-email-token"],
    mutationFn: verifyEmail,
    retry: false,
  });
};