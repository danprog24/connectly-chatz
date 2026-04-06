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
  const token = useAuthStore((state) => state.token);
  const queryClient = useQueryClient();

  const handleStatusUpdate = useCallback((update: StatusUpdate) => {
    queryClient.invalidateQueries({ queryKey: ["friends"] });
    queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    queryClient.invalidateQueries({ queryKey: ["profile", update.username] });
    queryClient.invalidateQueries({ queryKey: ["onlineStatus"] });
  }, [queryClient]);

    const connect = useCallback(() => {
    if (clientRef.current?.connected) {
      clientRef.current.deactivate();
    }

    // derive WebSocket URL from VITE_API_URL so only one env variable needed
    const baseUrl = (import.meta.env.VITE_API_URL as string)?.replace("/api", "") 
      || "http://localhost:8080";
    const wsUrl = `${baseUrl}/ws/websocket`;
    

    const client = new Client({
      webSocketFactory: () => new SockJS(wsUrl),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      onConnect: () => {
        client.publish({
          destination: "/app/user.online",
          body: JSON.stringify({}),
        });
        client.subscribe(`/user/${username}/queue/messages`, (message: IMessage) => {
          const received: ChatMessage = JSON.parse(message.body);
          onMessageReceived(received);
        });
        client.subscribe("/topic/status", (message: IMessage) => {
          const update: StatusUpdate = JSON.parse(message.body);
          handleStatusUpdate(update);
        });
      },
      onDisconnect: () => console.log("WebSocket disconnected"),
      onStompError: (frame) => console.error("STOMP error:", frame),
    });

    client.activate();
    clientRef.current = client;
  }, [username, token, onMessageReceived, handleStatusUpdate]);

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
      clientRef.current.publish({
        destination: "/app/user.offline",
        body: JSON.stringify({ username }),
      });
      clientRef.current.deactivate();
    }
  }, [username]);

  useEffect(() => {
    if (username && token) connect(); // only connect when both available
    return () => disconnect();
  }, [username, token]); // reconnect when token changes

  return { sendMessage };
};