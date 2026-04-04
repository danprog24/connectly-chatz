import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";


export const useOnlineStatus = () => {
  return useQuery<Record<string, boolean>>({
    queryKey: ["onlineStatus"],
    queryFn: async () => {
      const res = await api.get("/users/online-status");
      return res.data;
    },
    refetchInterval: 30000,
    staleTime: 15000,
  });
};


export const useIsOnline = (username: string): boolean => {
  const { data } = useOnlineStatus();
  return data?.[username] ?? false;
};
