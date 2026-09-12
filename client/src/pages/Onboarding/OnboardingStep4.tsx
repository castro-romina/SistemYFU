import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function OnboardingStep4() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const step1 = JSON.parse(localStorage.getItem("onboarding-step1") || "{}");
    const step2 = JSON.parse(localStorage.getItem("onboarding-step2") || "{}");
    const step3 = JSON.parse(localStorage.getItem("onboarding-step3") || "{}");
    const user = JSON.parse(localStorage.getItem("matchvol-user") || "{}");

    setUserData({ ...user, ...step1, ...step2, ...step3 });
  }, []);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // Aquí guardarías todo en la BD
      // await saveOnboardingData(userData);
      
      // Limpiar localStorage
      localStorage.removeItem("onboarding-step1");
      localStorage.removeItem("onboarding-step2");
      localStorage.removeItem("onboarding-step3");

      navigate("/InProgress");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <div className="flex justify-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">✓</div>
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">4</div>
          </div>
        </header>

        <div className="text-center py-8">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="font-bold text-2xl mb-2">
            !Todo listo, <span className="text-pink-500">{userData?.fullName}</span>!
          </h1>
          <p className="text-gray-600 mb-6">Tu cuenta fue creada con éxito.</p>
          
          <div className="bg-purple-100 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">Te enviamos un correo de bienvenida a</p>
            <p className="font-semibold text-purple-600">{userData?.email}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="font-bold text-lg mb-4">Resumen de tu perfil</h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-2">
                  👤
                </div>
                <p className="font-semibold text-sm">Datos Personales</p>
                <p className="text-xs text-gray-600">{userData?.fullName}</p>
                <button className="text-purple-600 text-xs font-semibold mt-2">Ver detalle</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center mx-auto mb-2">
                  💼
                </div>
                <p className="font-semibold text-sm">Perfil y habilidades</p>
                <p className="text-xs text-gray-600">{userData?.skills?.length || 0} habilidades</p>
                <button className="text-pink-600 text-xs font-semibold mt-2">Ver detalle</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-2">
                  📅
                </div>
                <p className="font-semibold text-sm">Disponibilidad</p>
                <p className="text-xs text-gray-600">Actualizado</p>
                <button className="text-purple-600 text-xs font-semibold mt-2">Ver detalle</button>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-pink-200 flex items-center justify-center mx-auto mb-2">
                  ❤️
                </div>
                <p className="font-semibold text-sm">Intereses</p>
                <p className="text-xs text-gray-600">Pendiente</p>
                <button className="text-pink-600 text-xs font-semibold mt-2">Ver detalle</button>
              </div>
            </div>
          </div>

          <div className="bg-purple-100 rounded-lg p-4 mb-6">
            <p className="text-sm font-semibold text-purple-900 mb-2">!Bienvenido a la comunidad MatchVol!</p>
            <p className="text-xs text-purple-800">Ahora puedes explorar oportunidades, postularte a tareas y empezar a generar impacto</p>
          </div>

          <Button
            onClick={handleFinish}
            disabled={isLoading}
            style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
            className="w-full hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3"
          >
            {isLoading ? "Guardando..." : "Ir a Inicio"}
          </Button>
        </div>
      </main>
    </div>
  );
}