import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import StepDots from "../../components/common/StepDots";
import LocationFields, { validatePhoneNumber, type LocationValue } from "../../components/common/LocationFields";
import ModalAviso from "../../components/common/ModalAviso";
import { usePersistedState } from "../../hooks/usePersistedState";

const KEY = "onboarding-org-step1";
const ORG_TYPES = ["Foundation", "NGO", "Civil association", "Cooperative", "Other"];

export default function OrgStep1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showOnboardingModal, setShowOnboardingModal] = useState(
    Boolean((location.state as { onboardingRequired?: boolean } | null)?.onboardingRequired)
  );

  const [nombre, setNombre] = usePersistedState("org-step1-nombre", "");
  const [tipo, setTipo] = usePersistedState("org-step1-tipo", "");
  const [locationValue, setLocationValue] = usePersistedState<LocationValue>("org-step1-location", {
    country: "",
    phone: "",
    city: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!nombre.trim()) return setError("Organization name is required");
    if (!tipo) return setError("Please select the type of organization");
    if (!locationValue.country) return setError("Country is required");
    if (!locationValue.phone.trim()) return setError("Phone number is required");
    if (!validatePhoneNumber(locationValue.phone, locationValue.country))
      return setError("Invalid phone number format for the selected country");
    if (!locationValue.city) return setError("Please select your city from the list");

    localStorage.setItem(
      KEY,
      JSON.stringify({
        nombre: nombre.trim(),
        tipo,
        pais: locationValue.country,
        ciudad: locationValue.city,
        telefono: locationValue.phone,
      })
    );
    navigate("/OnboardingOrg/step2");
  };

  return (
    <div className="auth-shell">
      {showOnboardingModal && (
        <ModalAviso
          title="Complete your organization's registration"
          message="Before you can use your account, you need to finish completing this form."
          onClose={() => setShowOnboardingModal(false)}
        />
      )}
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

          <LocationFields value={locationValue} onChange={setLocationValue} />

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