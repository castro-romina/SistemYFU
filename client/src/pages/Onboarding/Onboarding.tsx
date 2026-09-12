import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";

export default function Onboarding() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    // Guardar datos del paso 1
    localStorage.setItem("onboarding-step1", JSON.stringify({
      fullName, birthDate, country, phone, city, howHeard
    }));
    navigate("/Onboarding/step2");
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
          <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg mb-3" />
          <h1 className="font-display font-bold text-2xl tracking-tight text-center">
            Estamos felices de que te sumes a <span className="text-purple-600">Match</span><span className="text-pink-500">Vol</span>
          </h1>
          <p className="text-sm text-[#4B4560] text-center font-medium mt-2">Completa el formulario y empieza a conectar</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            id="fullName"
            label="Nombre completo"
            type="text"
            placeholder="Ej.: Juan Pérez"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <TextField
            id="birthDate"
            label="Fecha de nacimiento"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
          />

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
            required
          >
            <option value="">Selecciona tu país</option>
            <option value="Argentina">Argentina</option>
            <option value="Chile">Chile</option>
            <option value="Colombia">Colombia</option>
            <option value="México">México</option>
            <option value="Perú">Perú</option>
          </select>

          <TextField
            id="phone"
            label="Número de teléfono"
            type="tel"
            placeholder="+54 11 2345 6789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <TextField
            id="city"
            label="Ciudad"
            type="text"
            placeholder="Ej.: Salta"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <select
            value={howHeard}
            onChange={(e) => setHowHeard(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
            required
          >
            <option value="">¿Cómo te enteraste de MatchVol?</option>
            <option value="social_media">Redes sociales</option>
            <option value="friend">Un amigo</option>
            <option value="event">Un evento</option>
            <option value="search">Motor de búsqueda</option>
            <option value="other">Otro</option>
          </select>

          <Button
            type="submit"
            disabled={isLoading}
            style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
            className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
          >
            {isLoading ? "Guardando..." : "Continuar"}
          </Button>
        </form>
      </main>
    </div>
  );
}