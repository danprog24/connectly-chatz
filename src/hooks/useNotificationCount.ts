import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useAuthStore } from "./useAuthStore";
import { useFriend } from "./useFriends";

interface FriendRequest {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
}

// ── Pending friend requests count ─────────────────────────────────────────────
export const usePendingRequestsCount = () => {
  const username = useAuthStore((state) => state.username);

  const { data } = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      const res = await api.get("/friends/pending");
      return res.data;
    },
    enabled: !!username,
    refetchInterval: 30000, // poll every 30 seconds
    staleTime: 10000,
  });

  return data?.length ?? 0;
};

// ── Unread messages count ──────────────────────────────────────────────────────
export const useUnreadMessagesCount = () => {
  const username = useAuthStore((state) => state.username);
  const { data: friends } = useFriend(username ?? "");

  const { data } = useQuery<number>({
    queryKey: ["unreadMessages", username],
    queryFn: async () => {
      const res = await api.get("/messages/unread/count");
      return res.data;
    },
    enabled: !!username,
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return data ?? 0;
};

// ── Combined badge count ───────────────────────────────────────────────────────
export const useNotificationCount = () => {
  const pendingRequests = usePendingRequestsCount();
  const unreadMessages = useUnreadMessagesCount();

  return {
    pendingRequests,
    unreadMessages,
    total: pendingRequests + unreadMessages,
  };
};
