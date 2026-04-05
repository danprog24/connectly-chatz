import { useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client, type IMessage } from "@stomp/stompjs";
import { useAuthStore } from "./useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

interface ChatMessage {
  content: string;
  sender: string;
  receiver: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  time: string;
}

interface StatusUpdate {
  username: string;
  online: boolean;
}

interface UseWebSocketProps {
  onMessageReceived: (message: ChatMessage) => void;
}

export const useWebSocket = ({ onMessageReceived }: UseWebSocketProps) => {
  const clientRef = useRef<Client | null>(null);
  const username = useAuthStore((state) => state.username);
  const queryClient = useQueryClient();

  // ✅ handle incoming status updates — invalidate affected queries
  const handleStatusUpdate = useCallback((update: StatusUpdate) => {
    // invalidate friends list so online indicator updates
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    // invalidate suggestions
    queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    // invalidate specific user profile if open
    queryClient.invalidateQueries({ queryKey: ["profile", update.username] });
  }, [queryClient]);

  const connect = useCallback(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("https://connectly-chat-production.up.railway.app/ws"),
      reconnectDelay: 5000,

      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      onConnect: () => {
        client.publish({
          destination: "/app/user.online",
          body: JSON.stringify({}),
        });

        // ✅ subscribe to private messages
        client.subscribe(`/user/${username}/queue/messages`, (message: IMessage) => {
          const received: ChatMessage = JSON.parse(message.body);
          onMessageReceived(received);
        });

        // ✅ subscribe to status updates
        client.subscribe("/topic/status", (message: IMessage) => {
          const update: StatusUpdate = JSON.parse(message.body);
          handleStatusUpdate(update);
        });
      },

      onDisconnect: () => {
        console.log("WebSocket disconnected");
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    client.activate();
    clientRef.current = client;
  }, [username, onMessageReceived, handleStatusUpdate]);

  const sendMessage = useCallback((message: ChatMessage) => {
    if (clientRef.current?.connected) {
      clientRef.current.publish({
        destination: "/app/chat.privateMessage",
        body: JSON.stringify(message),
      });
    }
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      // ✅ announce offline before disconnecting
      clientRef.current.publish({
        destination: "/app/user.offline",
        body: JSON.stringify({ username }),
      });
      clientRef.current.deactivate();
    }
  }, [username]);

  useEffect(() => {
    if (username) connect();
    return () => disconnect();
  }, [username]);

  return { sendMessage };
};
