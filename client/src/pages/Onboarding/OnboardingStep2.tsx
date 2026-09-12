import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function OnboardingStep2() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [aboutYou, setAboutYou] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experience, setExperience] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const availableSkills = [
    "Comunicación",
    "Diseño gráfico",
    "Redes sociales",
    "Organización",
    "Excel",
    "Traducción",
    "Fotografía",
    "Administración",
    "Marketing",
    "Otros"
  ];

  const toggleSkill = (skill: string) => {
    setSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      localStorage.setItem("onboarding-step2", JSON.stringify({
        profilePhoto,
        aboutYou,
        skills,
        experience
      }));
      navigate("/Onboarding/step3");
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
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm">2</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">3</div>
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">4</div>
          </div>
          <h1 className="font-bold text-xl text-center">Perfil y habilidades</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Contamos más sobre vos para conectar con oportunidades ideales</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Foto de perfil</label>
            <div className="w-24 h-24 rounded-full bg-purple-200 flex items-center justify-center mx-auto mb-4">
              📸
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-2">Formatos: JPG, PNG, MAX. 5MB</p>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Sobre vos</label>
            <textarea
              value={aboutYou}
              onChange={(e) => setAboutYou(e.target.value)}
              placeholder="Escribe una breve presentación"
              className="w-full border rounded-lg p-2 text-sm"
              rows={4}
              maxLength={500}
            />
            <p className="text-xs text-gray-500 mt-1">{aboutYou.length}/500</p>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Habilidades</label>
            <div className="flex flex-wrap gap-2">
              {availableSkills.map(skill => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                    skills.includes(skill)
                      ? "bg-purple-600 text-white"
                      : "border border-purple-300 text-purple-600"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Experiencia previa</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Comparte sobre experiencias o proyectos relevantes"
              className="w-full border rounded-lg p-2 text-sm"
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/Onboarding")}
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