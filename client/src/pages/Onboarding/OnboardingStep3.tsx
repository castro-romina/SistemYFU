import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function OnboardingStep3() {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false
  });
  const [morningAvailable, setMorningAvailable] = useState(false);
  const [afternoonAvailable, setAfternoonAvailable] = useState(false);
  const [collaboration, setCollaboration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [flexibility, setFlexibility] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { key: "monday", label: "Lun" },
    { key: "tuesday", label: "Mar" },
    { key: "wednesday", label: "Mié" },
    { key: "thursday", label: "Jue" },
    { key: "friday", label: "Vie" },
    { key: "saturday", label: "Sáb" },
    { key: "sunday", label: "Dom" }
  ];

  const toggleDay = (day: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: !prev[day as keyof typeof availability]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("onboarding-step3", JSON.stringify({
        availability,
        morningAvailable,
        afternoonAvailable,
        collaboration,
        startDate,
        flexibility
      }));
      navigate("/Onboarding/step4");
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
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">3</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">4</div>
          </div>
          <h1 className="font-bold text-xl text-center">Disponibilidad</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Contamos cuándo y cómo te gustaría colaborar</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-3">¿Cuándo tienes disponibilidad?</label>
            <p className="text-xs text-gray-600 mb-3">Selecciona los días y horarios en los que puedes trabajar</p>
            
            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map(day => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => toggleDay(day.key)}
                  className={`py-2 rounded text-xs font-medium transition ${
                    availability[day.key as keyof typeof availability]
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={morningAvailable}
                  onChange={(e) => setMorningAvailable(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Mañana</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={afternoonAvailable}
                  onChange={(e) => setAfternoonAvailable(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">Tarde</span>
              </label>
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Preferencia de colaboración</label>
            <div className="space-y-2">
              {["En forma presencial", "De manera remota", "Híbrido (Presencial y remoto)"].map(option => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={collaboration === option}
                    onChange={() => setCollaboration(option)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Fecha de inicio</label>
            <p className="text-xs text-gray-600 mb-3">¿Desde cuándo estás disponible?</p>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Flexibilidad</label>
            <textarea
              value={flexibility}
              onChange={(e) => setFlexibility(e.target.value)}
              placeholder="Contanos que tan flexible eres en tu disponibilidad"
              className="w-full border rounded-lg p-2 text-sm"
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/Onboarding/step2")}
              className="flex-1 border border-purple-600 text-purple-600 font-semibold rounded-lg py-3"
            >
              Volver
            </button>
            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
              className="flex-1 hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3"
            >
              {isLoading ? "Guardando..." : "Continuar"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}