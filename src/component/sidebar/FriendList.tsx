// import React from "react";
// import { useChatStore } from "../../store/chatStore";
// import { useNavigate } from "react-router-dom";
// import { useFriend } from "../../hooks/useFriends";
// import type { Friend } from "../../types/chat";

// type FriendsListProps = {
//   userId: string;
// };

// const FriendsList: React.FC<FriendsListProps> = ({ userId }) => {
//   const navigate = useNavigate();
//   const { setSelectedFriend, activeTab } = useChatStore();

//   const { data: friends, isLoading, error } = useFriend(userId);

//   // Only render if we're on the chats, chatrooms, or calls tab
//   if (activeTab !== "chats" && activeTab !== "chatrooms" && activeTab !== "calls") return null;

  
//   return (
//     <div className="flex flex-col h-full bg-gray-900 text-white">
//       <div className="flex-1 overflow-y-auto">

//         {/* Chats Tab */}
//         {activeTab === "chats" && (
//           <div className="divide-y divide-gray-800">
//             {isLoading && (
//               <div className="p-4 text-gray-400">Loading chats...</div>
//             )}

//             {error && (
//               <div className="p-4 text-red-500">Failed to load chats.</div>
//             )}

//             {!isLoading && !error && friends?.length === 0 && (
//               <div className="p-4 text-gray-400">
//                 No friends yet. Add some from the suggestions tab!
//               </div>
//             )}

//             {friends?.map((friend: Friend) => (
//               <div
//                 key={friend.id}
//                 onClick={() => {
//                   setSelectedFriend(friend);
//                   navigate(`/chat/${friend.id}`);
//                 }}
//                 className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200"
//               >
//                 {/* Avatar */}
//                 <div className="relative">
//                   <img
//                     // Fix: use local fallback instead of external placeholder service
//                     src={friend.avatar || "/default-avatar.png"}
//                     className="w-12 h-12 rounded-full object-cover"
//                     alt={friend.username}
//                   />
//                   {friend.online && (
//                     <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full" />
//                   )}
//                 </div>

//                 {/* Chat Info */}
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-center">
//                     <span className="font-semibold truncate">{friend.username}</span>
//                     {/* Fix: use optional chained real data if available */}
//                     <span className="text-xs text-gray-400">
//                       {friend.lastMessageTime || ""}
//                     </span>
//                   </div>

//                   <div className="flex justify-between items-center mt-1">
//                     <span className="text-sm text-gray-400 truncate">
//                       {friend.lastMessage || "Start chatting..."}
//                     </span>
//                     {(friend.unreadCount ?? 0) > 0 && (
//                       <span className="ml-2 bg-green-500 text-xs px-2 py-0.5 rounded-full text-black font-semibold">
//                         {friend.unreadCount}
//                       </span>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Chatrooms Tab */}
//         {activeTab === "chatrooms" && (
//           <div className="p-4 text-gray-400">No chatrooms yet.</div>
//         )}

//         {/* Calls Tab */}
//         {activeTab === "calls" && (
//           <div className="p-4 text-gray-400">No recent calls.</div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default FriendsList;







import React from "react";
import { useChatStore } from "../../store/chatStore";
import { useNavigate } from "react-router-dom";
import { useFriend } from "../../hooks/useFriends";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import OnlineIndicator from "../OnlineIndicator";
import type { Friend } from "../../types/chat";

type FriendsListProps = {
  userId: string;
};

const FriendsList: React.FC<FriendsListProps> = ({ userId }) => {
  const navigate = useNavigate();
  const { setSelectedFriend, activeTab } = useChatStore();

  const { data: friends, isLoading, error } = useFriend(userId);

  // ✅ get live online statuses via polling
  const { data: onlineStatuses } = useOnlineStatus();

  if (activeTab !== "chats" && activeTab !== "chatrooms" && activeTab !== "calls") return null;

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="flex-1 overflow-y-auto">

        {activeTab === "chats" && (
          <div className="divide-y divide-gray-800">
            {isLoading && <div className="p-4 text-gray-400">Loading chats...</div>}
            {error && <div className="p-4 text-red-500">Failed to load chats.</div>}

            {!isLoading && !error && friends?.length === 0 && (
              <div className="p-4 text-gray-400">
                No friends yet. Add some from the suggestions tab!
              </div>
            )}

            {friends?.map((friend: Friend) => {
              // ✅ merge WebSocket status with polled status
              const isOnline = onlineStatuses?.[friend.username] ?? friend.online;

              return (
                <div
                  key={friend.id}
                  onClick={() => {
                    setSelectedFriend({ ...friend, online: isOnline });
                    navigate(`/chat/${friend.id}`);
                  }}
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-800 transition-all duration-200"
                >
                  {/* Avatar with online indicator */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={friend.avatar || "/default-avatar.png"}
                      className="w-12 h-12 rounded-full object-cover"
                      alt={friend.username}
                    />
                    <OnlineIndicator online={isOnline} size="md" /> {/* ✅ reusable */}
                  </div>

                  {/* Chat info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold truncate">{friend.username}</span>
                      <span className="text-xs text-gray-400">
                        {friend.lastMessageTime || ""}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-gray-400 truncate">
                        {/* ✅ show online/offline text instead of last message placeholder */}
                        {friend.lastMessage || (isOnline ? "Online" : "Offline")}
                      </span>
                      {(friend.unreadCount ?? 0) > 0 && (
                        <span className="ml-2 bg-green-500 text-xs px-2 py-0.5 rounded-full text-black font-semibold">
                          {friend.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === "chatrooms" && (
          <div className="p-4 text-gray-400">No chatrooms yet.</div>
        )}

        {activeTab === "calls" && (
          <div className="p-4 text-gray-400">No recent calls.</div>
        )}
      </div>
    </div>
  );
};

export default FriendsList;
