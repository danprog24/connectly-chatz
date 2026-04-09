import React from "react";
import { TABS } from "../constants/tabs";
import NotificationBadge from "./NotificationBadge";
import { usePendingRequestsCount, useUnreadMessagesCount } from "../hooks/useNotificationCount";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const BottomTabBar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const pendingRequests = usePendingRequestsCount();
  const unreadMessages = useUnreadMessagesCount();

  const badgeCounts: Record<string, number> = {
    notifications: pendingRequests,
    chats: unreadMessages,
  };

  return (
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
          {/* Icon with badge */}
          <div className="relative">
            <span className="text-lg">{tab.icon}</span>
            <NotificationBadge count={badgeCounts[tab.key] ?? 0} size="sm" />
          </div>
          <span className="text-[10px] font-medium">{tab.label.split(" ")[0]}</span>
          {activeTab === tab.key && (
            <span className="w-1 h-1 rounded-full bg-green-400" />
          )}
        </button>
      ))}
    </div>
  );
};

export default BottomTabBar;
