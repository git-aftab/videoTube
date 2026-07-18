import { useMutation } from "@tanstack/react-query";
import api from "../services/axios";
import type { User } from "../types";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string) => {
      const res = await api.post("/auth/forgot-password", { email });
      return res.data;
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: async ({
      resetToken,
      newPassword,
    }: {
      resetToken: string;
      newPassword: string;
    }) => {
      const res = await api.post(`/auth/reset-password/${resetToken}`, {
        newPassword,
      });
      return res.data;
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await api.post("/auth/change-password", {
        oldPassword,
        newPassword,
      });
      return res.data;
    },
  });
};

const updateProfileImage = async (endpoint: string, field: string, file: File) => {
  const formData = new FormData();
  formData.append(field, file);

  const res = await api.patch(endpoint, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return (res.data.data?.user ?? res.data.data) as User;
};

export const useUpdateAvatar = () => {
  return useMutation({
    mutationFn: (avatar: File) =>
      updateProfileImage("/auth/update-avatar", "avatar", avatar),
  });
};

export const useUpdateCoverImage = () => {
  return useMutation({
    mutationFn: (coverImage: File) =>
      updateProfileImage("/auth/update-coverimage", "coverImage", coverImage),
  });
};
