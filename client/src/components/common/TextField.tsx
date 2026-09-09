import React, { type InputHTMLAttributes } from "react";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
}

export default function TextField({ id, label, error, className = "", ...props }: TextFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      <label htmlFor={id} className="text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600/20 transition duration-150 text-sm
          ${error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-purple-600"}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600 font-medium mt-0.5" role="alert">{error}</p>}
    </div>
  );
}
