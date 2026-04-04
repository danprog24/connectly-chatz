import React, { useState } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import { useChatStore } from "../store/chatStore";
import { useWebSocketContext } from "./WebSocketContext";

interface Props {
  roomName: string;
}

const MessageInput: React.FC<Props> = ({ roomName: _roomName }) => {
  const [message, setMessage] = useState("");
  const username = useAuthStore((state) => state.username) ?? "";
  const { selectedFriend } = useChatStore();

  const { sendMessage } = useWebSocketContext(); // ✅ () not missing

  const handleSend = () => {
    if (!message.trim() || !selectedFriend || !username) return;

    sendMessage({
      content: message.trim(),
      sender: username,
      receiver: selectedFriend.username,
      type: "CHAT",
      time: new Date().toISOString(),
    });

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-2 p-3 border-t border-gray-700 bg-gray-900">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        rows={1}
        className="
          flex-1 bg-gray-800 text-white placeholder-gray-500
          rounded-2xl px-4 py-2.5 text-sm resize-none
          border border-gray-700 focus:outline-none focus:border-green-500
          transition-all duration-200 max-h-32 overflow-y-auto
        "
        style={{ minHeight: "42px" }}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim()}
        className="
          w-10 h-10 flex items-center justify-center rounded-full
          bg-green-500 hover:bg-green-600 text-black
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-all duration-200 flex-shrink-0
        "
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      </button>
    </div>
  );
};

export default MessageInput;
