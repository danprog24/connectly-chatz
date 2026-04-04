import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import SidebarIcons from "../sidebar/SidebarIcons";
import SuggestionsTab from "../Suggestions";
import FriendsList from "../sidebar/FriendList";
import { TABS } from "../../constants/tabs";
import ChatLayout from "../layout/ChatLayout";
import NotificationsTab from "./Notification";

const HomePage: React.FC = () => {
  const { selectedFriend, setSelectedFriend, activeTab, setActiveTab } = useChatStore();
  const username = useAuthStore((state) => state.username);
  const avatar = useAuthStore((state) => state.avatar); 
  const navigate = useNavigate();

  const showChatOnMobile = !!selectedFriend;

  return (
    <div className="h-screen flex bg-gray-900 overflow-hidden">

      {/* ── DESKTOP LAYOUT ── */}
      <div className="hidden md:flex w-full h-full">

        {/* 1. Icon Sidebar */}
        <div className="flex-shrink-0 h-full border-r border-gray-700">
          <SidebarIcons />
        </div>

        {/* 2. Tab Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col border-r border-gray-700 bg-gray-900 h-full">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <span className="text-white font-semibold text-base">Connectly</span>
            <button
              onClick={() => useAuthStore.getState().logout()}
              className="text-xs text-red-400 hover:text-red-300 transition-all"
            >
              Logout
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "suggestions" ? (
              <SuggestionsTab activeTab={activeTab} />
            ) : activeTab === "notifications" ? (
              <NotificationsTab activeTab={activeTab} />
            ) : (
              <FriendsList userId={username ?? ""} />
            )}
          </div>
        </div>

        {/* 3. Chat Area */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {selectedFriend ? (
            <ChatLayout />
          ) : (
            <div className="relative flex flex-col items-center justify-center w-full h-full bg-[#0b141a]">
              <div className="flex flex-col items-center gap-4 opacity-60">
                <div className="text-7xl">💬</div>
                <p className="text-xl font-medium text-gray-300">Connectly</p>
                <p className="text-sm text-gray-500">Select a chat to start messaging</p>
              </div>
              <div className="absolute bottom-8 flex items-center gap-2 text-gray-600 text-xs">
                <span>🔒</span>
                <span>End-to-end encrypted</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── MOBILE LAYOUT ── */}
      <div className="flex md:hidden w-full h-full flex-col">

        <div className={`flex flex-col w-full h-full ${showChatOnMobile ? "hidden" : "flex"}`}>

          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
            <span className="text-white font-semibold text-lg">Connectly</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/profile/${username}`)}
                className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-700 hover:border-green-500 transition-all"
              >
                {/* ✅ use avatar from store */}
                <img src={avatar || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
              </button>
              <button
                onClick={() => useAuthStore.getState().logout()}
                className="text-sm text-red-400 hover:text-red-300 transition-all"
              >
                Logout
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {activeTab === "suggestions" ? (
              <SuggestionsTab activeTab={activeTab} />
            ) : activeTab === "notifications" ? (
              <NotificationsTab activeTab={activeTab} />
            ) : (
              <FriendsList userId={username ?? ""} />
            )}
          </div>

          <div className="flex border-t border-gray-700 bg-gray-900 flex-shrink-0">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex-1 flex flex-col items-center justify-center py-2 gap-0.5
                  transition-all duration-200
                  ${activeTab === tab.key ? "text-green-400" : "text-gray-500 hover:text-gray-300"}
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label.split(" ")[0]}</span>
                {activeTab === tab.key && (
                  <span className="w-1 h-1 rounded-full bg-green-400" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className={`w-full h-full ${showChatOnMobile ? "flex flex-col" : "hidden"}`}>
          {selectedFriend && (
            <ChatLayout onBack={() => setSelectedFriend(null)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;