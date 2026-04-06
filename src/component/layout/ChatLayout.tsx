import React from "react";
import ChatMessages from "../ChatMessage";
import MessageInput from "../MessageInput";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useIsOnline } from "../../hooks/useOnlineStatus";
import OnlineIndicator from "../OnlineIndicator";

interface Props {
  onBack?: () => void;
}

const ChatLayout: React.FC<Props> = ({ onBack }) => {
  const { selectedFriend, setSelectedFriend } = useChatStore();
  const username = useAuthStore((state) => state.username) ?? "";
  const navigate = useNavigate();

  // live online status for selected friend
  const isOnline = useIsOnline(selectedFriend?.username ?? "");

  const roomName = username && selectedFriend?.username
    ? [username, selectedFriend.username].sort().join("-")
    : "";

  if (!selectedFriend) return null;

  return (
    <div className="flex flex-col h-full w-full min-w-0 overflow-hidden" style={{ background: "#0b141a" }}>

      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-700 bg-[#202c33] shadow-sm flex-shrink-0">

        {/* Back button */}
        <button
          onClick={() => {
            setSelectedFriend(null);
            if (onBack) onBack();
            else navigate("/");
          }}
          className="mr-3 text-gray-400 hover:text-white transition-all md:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar with live online indicator */}
        <div
          className="relative mr-3 cursor-pointer"
          onClick={() => navigate(`/profile/${selectedFriend.username}`)}
        >
          <img
            src={selectedFriend.avatar || "/default-avatar.png"}
            className="w-10 h-10 rounded-full object-cover"
            alt={selectedFriend.username}
          />
          <OnlineIndicator online={isOnline} size="sm" /> {/* ✅ live status */}
        </div>

        {/* Friend info — clickable to view profile */}
        <div
          className="flex flex-col flex-1 min-w-0 cursor-pointer"
          onClick={() => navigate(`/profile/${selectedFriend.username}`)}
        >
          <span className="font-semibold text-white truncate">{selectedFriend.username}</span>
          {/* ✅ live online/offline text */}
          <span className={`text-xs ${isOnline ? "text-green-400" : "text-gray-400"}`}>
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <ChatMessages roomName={roomName} />
      </div>

      {/* Input */}
      <div className="h-full w-full overflow-hidden min-h-0 flex-shrink-0">
        <MessageInput roomName={roomName} />
      </div>
    </div>
  );
};

export default ChatLayout;
