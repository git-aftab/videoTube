import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/axios";
import type { ApiResponse, Comment } from "../types";

interface CommentsResponse {
  comments: Comment[];
  totalCount: number;
}

// Fetch
const fetchComments = async (videoId: string): Promise<Comment[]> => {
  const res = await api.get<ApiResponse<CommentsResponse[]>>(
    `/comment/${videoId}`,
  );

  return res.data.data?.[0]?.comments ?? [];
};

export const useGetComments = (videoId: string) => {
  return useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => fetchComments(videoId),
    enabled: !!videoId,
  });
};

// Post Comment
const addComment = async ({
  videoId,
  content,
}: {
  videoId: string;
  content: string;
}) => {
  const res = await api.post(`/comment/${videoId}`, { content });
  return res.data.data;
};

export const useAddComment = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
};

// Del Comment
const delComment = async ({
  videoId,
  commentId,
}: {
  videoId: string;
  commentId: string;
}) => {
  const res = await api.delete(`/comment/${videoId}/${commentId}`);
  return res.data.data;
};

export const useDelComment = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: delComment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] }),
  });
};

// Update Comment
const updateComment = async ({
  videoId,
  commentId,
  content,
}: {
  videoId: string;
  commentId: string;
  content: string;
}) => {
  const res = await api.patch(`/comment/${videoId}/${commentId}`, { content });
  return res.data.data;
};

export const useUpdateComment = (videoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", videoId] });
    },
  });
};
