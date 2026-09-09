import React from "react";

export default function SocialAuth() {
  const socials = [
    {
      name: "Google",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#1f2937"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34a853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fbbc05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#ea4335"/>
        </svg>
      ),
    }
  ];

  return (
    <div>
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">o continuar con</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full">
        {socials.map((social) => (
          <button
            key={social.name}
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-lg hover:border-purple-600 transition text-gray-700 hover:text-purple-600 font-semibold"
          >
            {social.icon}
            <span className="hidden sm:inline">{social.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
