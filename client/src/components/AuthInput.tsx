import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

interface AuthInputProps {
  type?: "email" | "password" | "text";
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
}

export default function AuthInput({
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  icon,
  error,
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  const defaultIcon = type === "email" ? (
    <Mail className="w-5 h-5 text-gray-400" />
  ) : isPassword ? (
    <Lock className="w-5 h-5 text-gray-400" />
  ) : null;

  return (
    <div className="mb-5">
      {label && (
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {(icon || defaultIcon) && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            {icon || defaultIcon}
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full pl-12 pr-4 py-3 rounded-lg border-2 ${
            error ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:border-purple-600 transition`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}