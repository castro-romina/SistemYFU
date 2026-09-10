import React from "react";
import { useNavigate } from "react-router-dom";

export default function SocialAuth() {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      // 💡 Aquí irá la llamada de Firebase: signInWithPopup(auth, googleProvider)
      // Por ahora, simulamos un login exitoso guardando un usuario dummy
      const dummyUser = { name: "Google User", email: "user@gmail.com", role: "volunteer" };
      localStorage.setItem("matchvol-user", JSON.stringify(dummyUser));
      
      // Redirige al proceso
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Auth Failed", error);
    }
  };

  return (
    <div className="w-full mt-2">
      <button
        type="button"
        onClick={handleGoogleLogin} // ⚡ Vinculamos la función aquí
        className="w-full flex items-center justify-center gap-3 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm font-semibold text-gray-700 bg-white cursor-pointer"
      >
        {/* Tu SVG de Google se mantiene igual */}
        <span>Continue with Google</span>
      </button>
    </div>
  );
}
