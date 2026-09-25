import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import StepDots from "../../components/common/StepDots";
import { usePersistedState } from "../../hooks/usePersistedState";

const KEY = "onboarding-org-step3";
const TAX_ID_LABEL: Record<string, string> = { AR: "CUIT", CL: "RUT", CO: "NIT", MX: "RFC", PE: "RUC" };

// CUIT argentino: 11 dígitos + dígito verificador
const isValidCuit = (value: string): boolean => {
  const d = value.replace(/\D/g, "");
  if (d.length !== 11) return false;
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(d[i]), 0);
  const r = 11 - (sum % 11);
  return r !== 10 && (r === 11 ? 0 : r) === Number(d[10]);
};

export default function OrgStep3() {
  const navigate = useNavigate();
  const country: string = JSON.parse(localStorage.getItem("onboarding-org-step1") || "{}").pais || "";
  const taxLabel = TAX_ID_LABEL[country] || "Tax ID";

  const [sitioWeb, setSitioWeb] = usePersistedState("org-step3-sitioWeb", "");
  const [linkedin, setLinkedin] = usePersistedState("org-step3-linkedin", "");
  const [instagram, setInstagram] = usePersistedState("org-step3-instagram", "");
  const [cuit, setCuit] = usePersistedState("org-step3-cuit", "");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!sitioWeb.trim()) return setError("Website is required");
    if (!linkedin.trim()) return setError("LinkedIn is required");
    if (!linkedin.toLowerCase().includes("linkedin.com")) return setError("Enter a valid LinkedIn URL");
    if (!cuit.trim()) return setError(`${taxLabel} is required`);
    if (country === "AR" && !isValidCuit(cuit))
      return setError("Invalid CUIT. It must have 11 digits, for example 20-12345678-6");

    localStorage.setItem(
      KEY,
      JSON.stringify({
        sitioWeb: sitioWeb.trim(),
        linkedin: linkedin.trim(),
        instagram: instagram.trim(),
        cuit: cuit.trim(),
      })
    );
    navigate("/OnboardingOrg/step4");
  };

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <StepDots current={3} />
          <h1 className="font-bold text-xl text-center">Contact and verification</h1>
          <p className="text-sm text-gray-600 text-center mt-2">We use this to confirm your organization is real</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            id="website"
            label="Website"
            type="url"
            placeholder="https://yourorganization.org"
            value={sitioWeb}
            onChange={(e) => setSitioWeb(e.target.value)}
            required
          />
          <TextField
            id="linkedin"
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/company/yourorganization"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            required
          />
          <TextField
            id="instagram"
            label="Instagram (optional)"
            type="text"
            placeholder="https://instagram.com/yourorganization"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
          <TextField
            id="cuit"
            label={taxLabel}
            type="text"
            placeholder={country === "AR" ? "20-12345678-6" : ""}
            value={cuit}
            onChange={(e) => setCuit(e.target.value)}
            required
          />

          {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate("/OnboardingOrg/step2")}
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