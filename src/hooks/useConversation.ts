import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export const useConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/conversations").then(res => res.data),
    staleTime: 1000 * 60 * 5, // 5 mins cache
  });
};