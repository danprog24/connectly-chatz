import { create } from "zustand";
import type { Friend } from "../types/chat";

type Tab = "chats" | "chatrooms" |"suggestions"|"notifications"| "calls";

interface ChatState {
  selectedFriend: Friend | null;
  setSelectedFriend: (friend: Friend | null) => void;
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  selectedFriend: null,
  setSelectedFriend: (friend) => set({ selectedFriend: friend }),

  activeTab: "chats",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));