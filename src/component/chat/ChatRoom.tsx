import React from "react";
import { useParams } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";
import { useChatStore } from "../../store/chatStore";

const ChatPage: React.FC = () => {
  const { id } = useParams();
  const { selectedFriend } = useChatStore();

  if (!id) return (
    <div className="p-4 text-red-500">Invalid chat ID</div>
  );

  if (!selectedFriend) return (
    <div className="p-4 text-gray-400">Loading chat...</div>
  );

  return <ChatLayout friendId={id} />;
};

export default ChatPage;