import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMessages, sendMessage } from "../api/chatApi";
import type { Message } from "../types/chat";
import { useAuthStore } from "./useAuthStore";

// ─── useMessages ─────────────────────────────────────────────────────────────

export const useMessage = (friendId: string) => {
  return useQuery<Message[], Error>({
    queryKey: ["messages", friendId],
    queryFn: () => getMessages(friendId),
    enabled: !!friendId,
    placeholderData: (previousData) => previousData,
    retry: 2,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// ─── useSendMessage ───────────────────────────────────────────────────────────

  export const useMessages = (roomName: string) => {
    return useQuery<Message[], Error>({
      queryKey: ["messages", roomName],
      queryFn: () => getMessages(roomName),
      enabled: !!roomName && roomName !== "-", // ✅ guard
      refetchInterval: 3000,
      placeholderData: (previousData) => previousData,
      retry: 2,
      staleTime: 1000 * 10,
    });
  };

export const useSendMessage = (roomName: string) => {
  const queryClient = useQueryClient();

  return useMutation<Message, Error, { receiverId: string; content: string }>({ // ✅ string not number
    mutationFn: sendMessage,

    onMutate: async (variables) => {
      // ✅ query key matches useMessages key (string)
      await queryClient.cancelQueries({
        queryKey: ["messages", variables.receiverId],
      });

      const previousMessages = queryClient.getQueryData<Message[]>([
        "messages",
        variables.receiverId, // ✅ string
      ]);

    queryClient.setQueryData<Message[]>(
      ["messages", roomName],
      (old) => [
        ...(old || []),
        {
          id: `temp-${Date.now()}`,
          content: variables.content,
          sender: {                                          // ✅ match Message type
            id: 0,
            username: useAuthStore.getState().username ?? "",
            avatar: "",
          },
          timestamp: new Date().toISOString(),
          status: "sending",
        } as unknown as Message,                            // ✅ cast through unknown
      ]
    );
      return { previousMessages };
    },

    onError: (_err, variables, context) => {
      const ctx = context as { previousMessages?: Message[] } | undefined;
      if (ctx?.previousMessages) {
        queryClient.setQueryData(
          ["messages", variables.receiverId],
          ctx.previousMessages
        );
      }
    },

    onSettled: (_data, _err, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.receiverId], // ✅ string
      });
    },
  });
};