import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import StepDots from "../../components/common/StepDots";
import LocationFields, { validatePhoneNumber, type LocationValue } from "../../components/common/LocationFields";

const KEY = "onboarding-org-step1";
const ORG_TYPES = ["Foundation", "NGO", "Civil association", "Cooperative", "Other"];

export default function OrgStep1() {
  const navigate = useNavigate();
  const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
  const [nombre, setNombre] = useState<string>(saved.nombre || "");
  const [tipo, setTipo] = useState<string>(saved.tipo || "");
  const [location, setLocation] = useState<LocationValue>({
    country: saved.pais || "",
    phone: saved.telefono || "",
    city: saved.ciudad || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) return setError("Organization name is required");
    if (!tipo) return setError("Please select the type of organization");
    if (!location.country) return setError("Country is required");
    if (!location.phone.trim()) return setError("Phone number is required");
    if (!validatePhoneNumber(location.phone, location.country))
      return setError("Invalid phone number format for the selected country");
    if (!location.city) return setError("Please select your city from the list");

    localStorage.setItem(
      KEY,
      JSON.stringify({
        nombre: nombre.trim(),
        tipo,
        pais: location.country,
        ciudad: location.city,
        telefono: location.phone,
      })
    );
    navigate("/OnboardingOrg/step2");
  };

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg mb-3" />
          <StepDots current={1} />
          <h1 className="font-bold text-xl text-center">Tell us about your organization</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Volunteers will see this information</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            id="orgName"
            label="Organization name"
            type="text"
            placeholder="E.g.: Fundación Patitas"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="border border-gray-300 rounded-lg p-3 w-full"
            required
          >
            <option value="">Type of organization</option>
            {ORG_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <LocationFields value={location} onChange={setLocation} />

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <Button
            type="submit"
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
            className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
          >
            Continue
          </Button>
        </form>
      </main>
    </div>
  );
}