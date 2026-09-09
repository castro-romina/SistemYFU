import React from "react";

interface AuthButtonProps {
  children: React.ReactNode;
  type?: "primary" | "secondary";
  variant?: "full" | "half";
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function AuthButton({
  children,
  type = "primary",
  variant = "full",
  onClick,
  disabled = false,
  icon,
}: AuthButtonProps) {
  const baseStyles = `py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2`;
  
  const primaryStyles = `w-full bg-pink-500 text-white hover:bg-pink-600 disabled:bg-pink-300`;
  const secondaryStyles = `w-full bg-white text-gray-900 border-2 border-gray-300 hover:border-purple-600 hover:text-purple-600 disabled:border-gray-200`;
  
  const widthStyles = variant === "full" ? "w-full" : "flex-1";

  const typeStyles = type === "primary" ? primaryStyles : secondaryStyles;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${typeStyles} ${widthStyles}`}
    >
      {icon}
      {children}
    </button>
  );
}