import React from "react";
import { useParams } from "react-router-dom";
import ChatLayout from "../layout/ChatLayout";

const ChatPage: React.FC = () => {
  const { id } = useParams();

  if (!id) return <div>No chat selected</div>;

  return (
    <div className="h-screen">
      <ChatLayout friendId={id} />
    </div>
  );
};

export default ChatPage;