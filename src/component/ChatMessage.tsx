import React, { useEffect, useRef, useState } from "react";
import { useMessages } from "../hooks/useMessages";
import { useAuthStore } from "../hooks/useAuthStore";
import { useChatStore } from "../store/chatStore";
import { useWebSocketContext } from "./WebSocketContext";


interface LocalMessage {
  id: string | number;
  content: string;
  sender: string;
  receiver?: string;
  timestamp: string;
  status: "sending" | "sent" | "received";
}

interface Props {
  roomName: string;
}

const formatTime = (timestamp: string) => {
  if (!timestamp) return "";
  return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatDateLabel = (timestamp: string) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Today";
  if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
  return date.toLocaleDateString([], { day: "numeric", month: "long", year: "numeric" });
};

const isSameDay = (a: string, b: string) => {
  if (!a || !b) return false;
  return new Date(a).toDateString() === new Date(b).toDateString();
};

const StatusIcon: React.FC<{ status: LocalMessage["status"] }> = ({ status }) => {
  if (status === "sending") return (
    <svg className="w-3 h-3 text-white/40" fill="currentColor" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M8 5v3.5l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
  if (status === "sent") return (
    <svg className="w-4 h-3 text-white/60" viewBox="0 0 16 11" fill="none">
      <path d="M1 5.5L5.5 10L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  if (status === "received") return (
    <svg className="w-4 h-3 text-green-400" viewBox="0 0 18 11" fill="none">
      <path d="M1 5.5L5.5 10L15 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5.5L9.5 10L19 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  return null;
};

const DateSeparator: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center justify-center my-3">
    <span className="bg-[#182229] text-gray-400 text-[11px] px-3 py-1 rounded-full shadow">
      {label}
    </span>
  </div>
);

const ChatMessages: React.FC<Props> = ({ roomName }) => {
  const username = useAuthStore((state) => state.username) ?? "";
  const { selectedFriend } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [wsMessages, setWsMessages] = useState<LocalMessage[]>([]);

  // use context instead of creating new WebSocket connection
  const { lastMessage } = useWebSocketContext();

  const { data: history, isLoading } = useMessages(roomName);

  // react to new messages from context
  useEffect(() => {
    if (!lastMessage) return;
    if (
      lastMessage.type === "CHAT" &&
      (lastMessage.sender === selectedFriend?.username ||
        lastMessage.receiver === selectedFriend?.username)
    ) {
      setWsMessages((prev) => [
        ...prev,
        {
          id: `ws-${Date.now()}`,
          content: lastMessage.content,
          sender: lastMessage.sender,
          receiver: lastMessage.receiver,
          timestamp: lastMessage.time || new Date().toISOString(),
          status: "received",
        },
      ]);
    }
  }, [lastMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, wsMessages]);

  useEffect(() => {
    setWsMessages([]);
  }, [roomName]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center" style={{ background: "#0b141a" }}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-400 text-xs">Loading messages...</span>
        </div>
      </div>
    );
  }

  const historyMessages: LocalMessage[] = (history || []).map((msg) => ({
    id: msg.id,
    content: msg.content,
    sender: typeof msg.sender === "string" ? msg.sender : msg.sender?.username ?? "",
    timestamp: msg.timestamp || "",
    status: "sent" as const,
  }));

  const allMessages = [...historyMessages, ...wsMessages];

  return (
    <div className="flex-1 overflow-y-auto px-3 py-2 min-h-0" style={{ background: "#0b141a" }}>
      {allMessages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center gap-2 py-12">
          <div className="bg-[#182229] rounded-full p-4">
            <span className="text-3xl">🔒</span>
          </div>
          <p className="text-gray-400 text-sm text-center max-w-xs px-4">
            Messages are end-to-end encrypted. Say hi to{" "}
            <span className="text-green-400 font-medium">{selectedFriend?.username}</span>!
          </p>
        </div>
      )}

      {allMessages.map((msg, index) => {
        if (!msg.sender) return null;

        const isMine = msg.sender === username;
        const prevMsg = allMessages[index - 1];

        const showDate = !prevMsg || !isSameDay(prevMsg.timestamp, msg.timestamp);
        const isFirstInGroup = !prevMsg || prevMsg.sender !== msg.sender;

        return (
          <React.Fragment key={msg.id}>
            {showDate && <DateSeparator label={formatDateLabel(msg.timestamp)} />}

            <div className={`flex ${isMine ? "justify-end" : "justify-start"} ${isFirstInGroup ? "mt-2" : "mt-[2px]"}`}>
              <div className={`relative max-w-[75%] px-3 py-1.5 text-sm shadow-md text-white
                ${isMine ? "bg-[#005c4b]" : "bg-[#202c33]"}
                ${isMine
                  ? isFirstInGroup ? "rounded-tl-2xl rounded-tr-[4px] rounded-bl-2xl rounded-br-2xl" : "rounded-2xl"
                  : isFirstInGroup ? "rounded-tr-2xl rounded-tl-[4px] rounded-br-2xl rounded-bl-2xl" : "rounded-2xl"
                }
              `}>
                {isFirstInGroup && isMine && (
                  <div className="absolute -right-[6px] top-0 w-0 h-0"
                    style={{ borderLeft: "8px solid #005c4b", borderBottom: "8px solid transparent" }} />
                )}
                {isFirstInGroup && !isMine && (
                  <div className="absolute -left-[6px] top-0 w-0 h-0"
                    style={{ borderRight: "8px solid #202c33", borderBottom: "8px solid transparent" }} />
                )}

                <p className="leading-relaxed break-words whitespace-pre-wrap" style={{ paddingRight: isMine ? "52px" : "40px" }}>
                  {msg.content}
                </p>

                <div className="absolute bottom-1.5 right-2 flex items-center gap-1">
                  <span className="text-[10px] text-white/50 whitespace-nowrap">
                    {formatTime(msg.timestamp)}
                  </span>
                  {isMine && <StatusIcon status={msg.status} />}
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}

      <div ref={bottomRef} className="h-1" />
    </div>
  );
};

export default ChatMessages;
