import { useEffect, useRef } from "react";
import type { Message } from "../types/chat";

export const useChatSocket = (friendId: string, onMessage: (msg: Message) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8080/ws/chat/${friendId}`);
    socketRef.current = ws;

    ws.onmessage = (event) => {
      const data: Message = JSON.parse(event.data);
      onMessage(data);
    };

    ws.onopen = () => console.log("Connected to WebSocket");
    ws.onclose = () => console.log("WebSocket closed");

    return () => ws.close();
  }, [friendId]);

  return socketRef;
};