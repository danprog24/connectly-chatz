import React from "react";

interface Props {
  count: number;
  size?: "sm" | "md";
}

// reusable badge component
const NotificationBadge: React.FC<Props> = ({ count, size = "md" }) => {
  if (count <= 0) return null;

  return (
    <span className={`
      absolute flex items-center justify-center
      bg-red-500 text-white font-bold rounded-full
      ${size === "sm" 
        ? "w-4 h-4 text-[9px] -top-1 -right-1" 
        : "w-5 h-5 text-[10px] -top-1.5 -right-1.5"
      }
    `}>
      {count > 99 ? "99+" : count}
    </span>
  );
};

export default NotificationBadge;
