import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/axios";
import { useSuggestions } from "../hooks/useSuggestion";
import { useAuthStore } from "../hooks/useAuthStore";

interface User {
  id: number;
  username: string;
  avatar?: string;
  online: boolean;
}

interface SuggestionsTabProps {
  activeTab: string;
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ activeTab }) => {
  const queryClient = useQueryClient();

  
  const loggedInUserId = useAuthStore((state) => state.username) ?? "";
  const { data: suggestions, isLoading, isError } = useSuggestions(loggedInUserId);

  
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [_errorId, setErrorId] = useState<number | null>(null);

  // Add this state alongside pendingId and errorId
  const [sentIds, setSentIds] = useState<number[]>([]);

      const addFriendMutation = useMutation({
        mutationFn: async (receiverId: number) => {
          setPendingId(receiverId);
          setErrorId(null);
          await api.post(`/friends/send/${receiverId}`);
        },
        onSuccess: (_, receiverId) => {
          setPendingId(null);
          setSentIds((prev) => [...prev, receiverId]); // ✅ track sent
          queryClient.invalidateQueries({ queryKey: ["suggestions"] });
          queryClient.invalidateQueries({ queryKey: ["friends", loggedInUserId] });
        },
        onError: (_err, userId) => {
          setPendingId(null);
          setErrorId(userId);
        },
    });
  if (activeTab !== "suggestions") return null;

  return (
    <div className="divide-y divide-gray-800 h-full flex flex-col">
      {isLoading && (
        <div className="p-4 text-gray-400">Loading users...</div>
      )}

      {isError && (
        <div className="p-4 text-red-500">Failed to load users.</div>
      )}

      {!isLoading && !isError && suggestions?.length === 0 && (
        <div className="p-4 text-gray-400">No suggestions found.</div>
      )}

      {suggestions?.map((user: User) => (
        <div
          key={user.id}
          className="flex items-center justify-between p-4 hover:bg-gray-800 rounded transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt={user.username}
                className="w-10 h-10 rounded-full object-cover"
              />
              {user.online && (
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-gray-900 rounded-full" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-white">{user.username}</span>
              <span className="text-xs text-gray-400">
                {user.online ? "Online" : "Offline"}
              </span>
            </div>
          </div>

          <button
              onClick={() => !sentIds.includes(user.id) && addFriendMutation.mutate(user.id)}
              disabled={pendingId === user.id || sentIds.includes(user.id)}
              className={`px-3 py-1 rounded-lg text-sm transition-all
                ${sentIds.includes(user.id)
                  ? "bg-gray-600 text-gray-300 cursor-default"
                  : "bg-green-500 hover:bg-green-600 text-black disabled:opacity-50"
                }
              `}
            >
              {pendingId === user.id
                ? "Sending..."
                : sentIds.includes(user.id)
                ? "✓ Sent"
                : "Add"
              }
            </button>
        </div>
      ))}
    </div>
  );
};

export default SuggestionsTab;