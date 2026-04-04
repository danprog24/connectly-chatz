// import React from "react";
// import { useChatStore } from "../../store/chatStore";
// import { useAuthStore } from "../../hooks/useAuthStore";

// const HomeHeader: React.FC = () => {
//   const { activeTab, setActiveTab } = useChatStore();
//   const { logout } = useAuthStore();

//   const tabs = [
//     { key: "chats", label: "Chats" },
//     { key: "chatrooms", label: "Chatrooms" },
//     { key: "suggestions", label: "Friends Suggestions" },
//     { key: "calls", label: "Calls" },
//   ] as const;

//   return (
//     <div className="
//       bg-gray-800 text-white relative p-4 border-b border-gray-700
//       md:h-screen md:w-64 md:flex md:flex-col md:border-r md:border-b-0
//     ">

//       {/* Top bar */}
//       <div className="flex justify-between items-center mb-3 md:mb-6">
//         <div className="text-lg font-semibold md:text-xl">
//           Connectly Chats
//         </div>

//        <button
//           onClick={logout}
//           className="
//             bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm
//             md:absolute md:bottom-4 md:left-4 md:right-4
//           "
//         >
//           Logout
//         </button>
//       </div>

//       {/* Tabs */}
//       <div className="flex justify-between md:flex-col md:gap-2">
//         {tabs.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`
//               flex-1 text-center pb-2
//               md:text-left md:px-3 md:py-2 md:rounded-lg md:flex-none
//               transition-all
//               ${
//                 activeTab === tab.key
//                   ? "border-b-2 border-green-500 text-green-400 md:border-none md:bg-gray-700"
//                   : "text-gray-400 hover:text-white md:hover:bg-gray-700"
//               }
//             `}
//           >
//             {tab.label}
//           </button>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default HomeHeader;






import React from "react";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../hooks/useAuthStore";
// Fix: import centralized tabs
import { TABS } from "../../constants/tabs";

const HomeHeader: React.FC = () => {
  const { activeTab, setActiveTab } = useChatStore();
  const { logout } = useAuthStore();

  return (
    <div className="
      bg-gray-800 text-white relative p-4 border-b border-gray-700
      md:h-screen md:w-64 md:flex md:flex-col md:border-r md:border-b-0
    ">

      {/* Top bar */}
      <div className="flex justify-between items-center mb-3 md:mb-6">
        <div className="text-lg font-semibold md:text-xl">
          Connectly Chats
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-between md:flex-col md:gap-2 md:flex-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex-1 text-center pb-2
              md:text-left md:px-3 md:py-2 md:rounded-lg md:flex-none
              transition-all duration-200
              ${
                activeTab === tab.key
                  ? "border-b-2 border-green-500 text-green-400 md:border-none md:bg-gray-700"
                  : "text-gray-400 hover:text-white md:hover:bg-gray-700"
              }
            `}
          >
            {/* Show icon on mobile, label on desktop */}
            <span className="md:hidden">{tab.icon}</span>
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Fix: logout button moved outside flex row, properly positioned */}
      <button
        onClick={logout}
        className="
          mt-4 w-full bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-sm transition-all
          md:absolute md:bottom-4 md:left-4 md:right-4 md:w-auto
        "
      >
        Logout
      </button>
    </div>
  );
};

export default HomeHeader;
