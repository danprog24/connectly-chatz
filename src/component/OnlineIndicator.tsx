import React from "react";

// ✅ reusable online indicator component used across friends list, chat header and profile
interface Props {
  online: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "w-2 h-2 border",
  md: "w-3 h-3 border-2",
  lg: "w-4 h-4 border-2",
};

const OnlineIndicator: React.FC<Props> = ({ online, size = "md", className = "" }) => {
  if (!online) return null;

  return (
    <span
      className={`
        absolute bottom-0 right-0 rounded-full
        bg-green-500 border-gray-900
        ${sizes[size]}
        ${className}
      `}
    />
  );
};

export default OnlineIndicator;
