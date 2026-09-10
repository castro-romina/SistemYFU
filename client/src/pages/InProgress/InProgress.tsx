import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function InProcess() {
  const navigate = useNavigate();
  // Recuperamos el usuario guardado en el localStorage para saludarlo
  const userString = localStorage.getItem("matchvol-user");
  const user = userString ? JSON.parse(userString) : { name: "Volunteer" };

  const handleLogout = () => {
    localStorage.removeItem("matchvol-user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#fcfaff] flex items-center justify-center p-6 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center border border-gray-100">
        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold animate-bounce">
          ⚙️
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Hola, {user.name}!</h1>
        <h2 className="text-xl font-extrabold text-purple-600 mb-4">MatchVol está en proceso</h2>
        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
          Tu cuenta fue procesada correctamente. Actualmente estamos construyendo tu panel de control personalizado. ¡Pronto estará listo!
        </p>
        <Button onClick={handleLogout} className="bg-pink-500 hover:bg-pink-600 text-white w-full py-2.5">
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}
