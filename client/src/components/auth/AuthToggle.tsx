import React from "react";
import { UserRound, Building2 } from "lucide-react";

interface AuthToggleProps {
  value: "volunteer" | "organization";
  onChange: (value: "volunteer" | "organization") => void;
}

export default function AuthToggle({ value, onChange }: AuthToggleProps) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        type="button"
        onClick={() => onChange("volunteer")}
        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
          value === "volunteer"
            ? "bg-purple-600 text-white"
            : "bg-white text-gray-900 border-2 border-gray-300 hover:border-purple-600"
        }`}
      >
        <UserRound className="w-5 h-5" />
        Soy Voluntario/a
      </button>
      <button
        type="button"
        onClick={() => onChange("organization")}
        className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
          value === "organization"
            ? "bg-purple-600 text-white"
            : "bg-white text-gray-900 border-2 border-gray-300 hover:border-purple-600"
        }`}
      >
        <Building2 className="w-5 h-5" />
        Soy una Organización
      </button>
    </div>
  );
}