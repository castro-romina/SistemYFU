import React, { type ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
}

export default function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  // Clases base compartidas por todos los botones
  const baseStyles = "w-full px-6 py-3 font-semibold rounded-lg transition duration-200 text-center flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Estilos específicos según el propósito
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white shadow-sm",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
