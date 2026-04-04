export const TABS = [
  { key: "chats", label: "Chats", icon: "💬" },
  { key: "chatrooms", label: "Chatrooms", icon: "👥" },
  { key: "suggestions", label: "Friends Suggestions", icon: "➕" },
  { key: "notifications", label: "Notifications", icon: "🔔" },
  { key: "calls", label: "Calls", icon: "📞" },
] as const;

export type TabKey = (typeof TABS)[number]["key"];
