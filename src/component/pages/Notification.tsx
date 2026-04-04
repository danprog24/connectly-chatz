import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../api/axios";

interface FriendRequestUser {
  id: number;
  username: string;
  avatar?: string;
  online: boolean;
}

interface FriendRequest {
  id: number;
  sender: FriendRequestUser;
  receiver: FriendRequestUser;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELED";
}

interface NotificationsTabProps {
  activeTab: string;
}

// ── API calls ─────────────────────────────────────────────────────────────────

const fetchPendingRequests = async (): Promise<FriendRequest[]> => {
  const res = await api.get("/friends/pending");
  return res.data;
};

const acceptRequest = async (requestId: number): Promise<FriendRequest> => {
  const res = await api.put(`/friends/accept/${requestId}`);
  return res.data;
};

const rejectRequest = async (requestId: number): Promise<void> => {
  await api.put(`/friends/reject/${requestId}`);
};

// ── Component ─────────────────────────────────────────────────────────────────

const NotificationsTab: React.FC<NotificationsTabProps> = ({ activeTab }) => {
  const queryClient = useQueryClient();

  const { data: requests, isLoading, isError } = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests"],
    queryFn: fetchPendingRequests,
    enabled: activeTab === "notifications",
    refetchInterval: 10000, // poll every 10 seconds
  });

  const acceptMutation = useMutation({
    mutationFn: acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] });
    },
  });

  if (activeTab !== "notifications") return null;

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700">
        <h2 className="text-white font-semibold text-base">Friend Requests</h2>
        {requests && requests.length > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{requests.length} pending</p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-gray-800">

        {isLoading && (
          <div className="p-4 text-gray-400 text-sm">Loading requests...</div>
        )}

        {isError && (
          <div className="p-4 text-red-500 text-sm">Failed to load requests.</div>
        )}

        {!isLoading && !isError && requests?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <span className="text-4xl mb-3">🔔</span>
            <p className="text-sm">No pending friend requests</p>
          </div>
        )}

        {requests?.map((request) => (
          <div
            key={request.id}
            className="flex items-center justify-between p-4 hover:bg-gray-800 transition-all duration-200"
          >
            {/* Left — sender info */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={request.sender.avatar || "/default-avatar.png"}
                  alt={request.sender.username}
                  className="w-11 h-11 rounded-full object-cover"
                />
                {request.sender.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-white text-sm">
                  {request.sender.username}
                </span>
                <span className="text-xs text-gray-400">
                  Wants to be your friend
                </span>
              </div>
            </div>

            {/* Right — accept/reject buttons */}
            <div className="flex items-center gap-2">
              {/* Accept */}
              <button
                onClick={() => acceptMutation.mutate(request.id)}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-black text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all font-medium"
              >
                {acceptMutation.isPending ? "..." : "Accept"}
              </button>

              {/* Reject */}
              <button
                onClick={() => rejectMutation.mutate(request.id)}
                disabled={acceptMutation.isPending || rejectMutation.isPending}
                className="bg-gray-700 hover:bg-gray-600 text-white text-sm px-3 py-1.5 rounded-lg disabled:opacity-50 transition-all"
              >
                {rejectMutation.isPending ? "..." : "Decline"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsTab;
