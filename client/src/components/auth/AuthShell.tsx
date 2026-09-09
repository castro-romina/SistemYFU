import React, { type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthShell({ children, title, subtitle }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-8 font-sans">
      <main className="bg-white p-6 md:p-8 rounded-xl shadow-md max-w-md w-full border border-gray-100 animate-in fade-in duration-200">
        <header className="text-center mb-6">
          <Link to="/" className="text-2xl font-extrabold text-purple-600 tracking-tight hover:opacity-90">
            Match<span className="text-gray-900">Vol</span>
          </Link>
          <h1 className="text-2xl font-black text-gray-950 mt-4 mb-1">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </header>
        
        {children}
      </main>
    </div>
  );
}
