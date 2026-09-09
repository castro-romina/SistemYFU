import React from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-lg p-10 w-full max-w-md">
        <h1 className="font-display text-2xl font-bold mb-1">
          <span className="text-purple-600">¡Bienvenido a </span>
          <span className="text-purple-600">Match</span>
          <span className="text-pink-500">Vol</span>
          <span className="text-purple-600">!</span>
        </h1>
        {subtitle && (
          <p className="text-gray-600 text-sm mb-8">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
}