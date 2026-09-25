import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import StepDots from "../../components/common/StepDots";
import PhotoPicker from "../../components/common/PhotoPicker";
import ChipSelect from "../../components/common/ChipSelect";
import { usePersistedState } from "../../hooks/usePersistedState";

const KEY = "onboarding-org-step2";
const AREAS = [
  "Animal rescue",
  "Education",
  "Health",
  "Environment",
  "Food and hunger",
  "Housing",
  "Human rights",
  "Children and youth",
  "Elderly care",
  "Culture and arts",
  "Sports",
  "Disaster relief",
  "Other",
];

export default function OrgStep2() {
  const navigate = useNavigate();
  const [logo, setLogo] = usePersistedState("org-step2-logo", "");
  const [descripcion, setDescripcion] = usePersistedState("org-step2-descripcion", "");
  const [mision, setMision] = usePersistedState("org-step2-mision", "");
  const [areasTrabajo, setAreasTrabajo] = usePersistedState<string[]>("org-step2-areasTrabajo", []);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!descripcion.trim()) return setError("Description is required");
    if (areasTrabajo.length === 0) return setError("Select at least one area of work");

    try {
      localStorage.setItem(
        KEY,
        JSON.stringify({ logo, descripcion: descripcion.trim(), mision: mision.trim(), areasTrabajo })
      );
      navigate("/OnboardingOrg/step3");
    } catch {
      setError("Could not save your data. Try a smaller logo.");
    }
  };

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <StepDots current={2} />
          <h1 className="font-bold text-xl text-center">Public profile</h1>
          <p className="text-sm text-gray-600 text-center mt-2">Help volunteers understand what you do</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form space-y-4">
          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Logo (optional)</label>
            <PhotoPicker value={logo} onChange={setLogo} />
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="descripcion" className="block font-semibold mb-2">Description</label>
            <textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="What does your organization do?"
              className="w-full border rounded-lg p-2 text-sm"
              rows={4}
              maxLength={500}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{descripcion.length}/500</p>
          </div>

          <div className="border rounded-lg p-4">
            <label htmlFor="mision" className="block font-semibold mb-2">Mission (optional)</label>
            <textarea
              id="mision"
              value={mision}
              onChange={(e) => setMision(e.target.value)}
              placeholder="What change do you want to make?"
              className="w-full border rounded-lg p-2 text-sm"
              rows={3}
              maxLength={300}
            />
            <p className="text-xs text-gray-500 mt-1">{mision.length}/300</p>
          </div>

          <div className="border rounded-lg p-4">
            <label className="block font-semibold mb-2">Areas of work</label>
            <ChipSelect options={AREAS} selected={areasTrabajo} onChange={setAreasTrabajo} />
          </div>

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/OnboardingOrg")}
              className="flex-1 border border-purple-600 text-purple-600 font-semibold rounded-lg py-3"
            >
              Back
            </button>
            <Button
              type="submit"
              style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
              className="flex-1 hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3"
            >
              Continue
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}