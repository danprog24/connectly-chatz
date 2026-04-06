import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import type { Friend } from "../types/chat";

export const getFriendById = async (userId: string): Promise<Friend[]> => {
  const res = await api.get(`/users/${userId}/friends`);
  return res.data;
};

export const useFriend = (userId: string) => {
  return useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: () => getFriendById(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
