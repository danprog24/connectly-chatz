// import React from "react";
// import { useNavigate } from "react-router-dom";
// import { useChatStore } from "../../store/chatStore";
// import { useAuthStore } from "../../hooks/useAuthStore";
// import { TABS } from "../../constants/tabs";

// const SidebarIcons: React.FC = () => {
//   const { activeTab, setActiveTab } = useChatStore();
//   const navigate = useNavigate();
//   const username = useAuthStore((state) => state.username);
//   const avatar = useAuthStore((state) => state.avatar);


//   return (
//     <div className="hidden md:flex flex-col items-center w-16 bg-gray-900 py-4 border-r border-gray-800 h-full justify-between">

//       {/* Top — tab icons */}
//       <div className="flex flex-col items-center gap-6">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             title={tab.label}
//             aria-label={tab.label}
//             className={`text-xl p-2 rounded-lg transition-all duration-200 ${
//               activeTab === tab.key
//                 ? "text-green-400 bg-gray-800"
//                 : "text-gray-500 hover:text-white hover:bg-gray-800"
//             }`}
//           >
//             {tab.icon}
//           </button>
//         ))}
//       </div>

//       {/* Bottom — profile button */}
//       <button
//         onClick={() => navigate(`/profile/${username}`)}
//         title="My Profile"
//         aria-label="My Profile"
//         className="mb-2 w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 hover:border-green-500 transition-all"
//       >
//         <img
//           src={avatar || "/default-avatar.png"}
//           alt="My profile"
//           className="w-full h-full object-cover"
//         />
//       </button>

//     </div>
//   );
// };

// export default SidebarIcons;





import React from "react";
import { useNavigate } from "react-router-dom";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { TABS } from "../../constants/tabs";
import NotificationBadge from "../NotificationBadge";
import { usePendingRequestsCount, useUnreadMessagesCount } from "../../hooks/useNotificationCount";

const SidebarIcons: React.FC = () => {
  const { activeTab, setActiveTab } = useChatStore();
  const navigate = useNavigate();
  const username = useAuthStore((state) => state.username);
  const avatar = useAuthStore((state) => state.avatar);

  // ✅ badge counts
  const pendingRequests = usePendingRequestsCount();
  const unreadMessages = useUnreadMessagesCount();

  // ✅ map tab keys to their badge counts
  const badgeCounts: Record<string, number> = {
    notifications: pendingRequests,
    chats: unreadMessages,
  };

  return (
    <div className="hidden md:flex flex-col items-center w-16 bg-gray-900 py-4 border-r border-gray-800 h-full justify-between">

      {/* Top — tab icons */}
      <div className="flex flex-col items-center gap-6">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            title={tab.label}
            aria-label={tab.label}
            className={`relative text-xl p-2 rounded-lg transition-all duration-200 ${
              activeTab === tab.key
                ? "text-green-400 bg-gray-800"
                : "text-gray-500 hover:text-white hover:bg-gray-800"
            }`}
          >
            {tab.icon}
            {/* ✅ show badge if count > 0 */}
            <NotificationBadge count={badgeCounts[tab.key] ?? 0} size="sm" />
          </button>
        ))}
      </div>

      {/* Bottom — profile button */}
      <button
        onClick={() => navigate(`/profile/${username}`)}
        title="My Profile"
        aria-label="My Profile"
        className="mb-2 w-10 h-10 rounded-full overflow-hidden border-2 border-gray-700 hover:border-green-500 transition-all"
      >
        <img
          src={avatar || "/default-avatar.png"}
          alt="My profile"
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
};

export default SidebarIcons;
