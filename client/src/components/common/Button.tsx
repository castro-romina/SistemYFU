import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  const baseStyles = "w-full px-6 py-3 font-semibold rounded-lg transition duration-200 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-pink-500 hover:bg-pink-600 text-white shadow-sm",
    secondary: "bg-white hover:bg-purple-50 text-purple-600 border border-purple-600",
    danger: "bg-pink-500 hover:bg-pink-600 text-white shadow-sm"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}