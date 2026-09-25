import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import StepDots from "../../components/common/StepDots";
import { completeOrgOnboarding } from "../../lib/api";
import { clearPersistedKeys } from "../../hooks/usePersistedState";

const KEYS = ["onboarding-org-step1", "onboarding-org-step2", "onboarding-org-step3"];

const ORG_FORM_KEYS = [
  "org-step1-nombre",
  "org-step1-tipo",
  "org-step1-location",
  "org-step2-logo",
  "org-step2-descripcion",
  "org-step2-mision",
  "org-step2-areasTrabajo",
  "org-step3-sitioWeb",
  "org-step3-linkedin",
  "org-step3-instagram",
  "org-step3-cuit",
];

export default function OrgStep4() {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("matchvol-user") || "{}");
    const steps = KEYS.map((k) => JSON.parse(localStorage.getItem(k) || "{}"));
    setData(steps.reduce((acc, s) => ({ ...acc, ...s }), user));
  }, []);

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      await completeOrgOnboarding(data);
      KEYS.forEach((k) => localStorage.removeItem(k));
      clearPersistedKeys(ORG_FORM_KEYS);
      navigate("/InProgress");
    } catch (error) {
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
      setIsLoading(false);
    }
  };


  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <StepDots current={4} />
        </header>

        <div className="text-center py-4">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="font-bold text-2xl mb-2">
            All set, <span className="text-pink-500">{data?.nombre}</span>!
          </h1>
          <p className="text-gray-600 mb-6">Review your details and finish creating your account.</p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm space-y-1">
            <p><span className="font-semibold">Type:</span> {data?.tipo}</p>
            <p><span className="font-semibold">Areas of work:</span> {(data?.areasTrabajo || []).join(", ")}</p>
            <p><span className="font-semibold">Website:</span> {data?.sitioWeb}</p>
            <p><span className="font-semibold">Contact email:</span> {data?.email}</p>
          </div>

          <Button
            onClick={handleFinish}
            disabled={isLoading || !data}
            style={{ backgroundColor: "#ec4899", color: "#ffffff" }}
            className="w-full hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3"
          >
            {isLoading ? "Saving..." : "Finish and go to home"}
          </Button>
        </div>
      </main>
    </div>
  );
}