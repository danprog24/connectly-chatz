import React, { createContext, useContext, useState, useCallback } from "react";
import { useWebSocket } from "../hooks/useWebSocket";

interface ChatMessage {
  content: string;
  sender: string;
  receiver: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  time: string;
}

interface WebSocketContextType {
  sendMessage: (msg: ChatMessage) => void;
  lastMessage: ChatMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  sendMessage: () => {},
  lastMessage: null,
});

// ✅ single WebSocket connection for entire app
export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lastMessage, setLastMessage] = useState<ChatMessage | null>(null);

  const handleMessageReceived = useCallback((message: ChatMessage) => {
    setLastMessage(message);
  }, []);

  const { sendMessage } = useWebSocket({ onMessageReceived: handleMessageReceived });

  return (
    <WebSocketContext.Provider value={{ sendMessage, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => useContext(WebSocketContext);