import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SocialAuth from "./components/auth/SocialAuth";
import AuthToggle from "./components/auth/AuthToggle";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import ForgotPassword from "./pages/Login/ForgotPassword"; 
import InProcess from "./pages/InProgress/InProgress";
import Onboarding from "./pages/Onboarding/Onboarding-nominatim";
import OnboardingStep2 from "./pages/Onboarding/OnboardingStep2";
import OnboardingStep3 from "./pages/Onboarding/OnboardingStep3";
import OnboardingStep4 from "./pages/Onboarding/OnboardingStep4";
import ResetPassword from "./pages/Login/ResetPassword";
import OrgStep1 from "./pages/OnboardingOrg/OrgStep1";
import OrgStep2 from "./pages/OnboardingOrg/OrgStep2";
import OrgStep3 from "./pages/OnboardingOrg/OrgStep3";
import OrgStep4 from "./pages/OnboardingOrg/OrgStep4";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth" element={<SocialAuth />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/InProgress" element={<InProcess />} />
      <Route path="/Onboarding" element={<Onboarding />} />
      <Route path="/Onboarding/step2" element={<OnboardingStep2 />} />
      <Route path="/Onboarding/step3" element={<OnboardingStep3 />} />
      <Route path="/Onboarding/step4" element={<OnboardingStep4 />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/OnboardingOrg" element={<OrgStep1 />} />
      <Route path="/OnboardingOrg/step2" element={<OrgStep2 />} />
      <Route path="/OnboardingOrg/step3" element={<OrgStep3 />} />
      <Route path="/OnboardingOrg/step4" element={<OrgStep4 />} />
      <Route path="/onboarding-organization" element={<Navigate to="/OnboardingOrg" replace />} />
    </Routes>
  );
}
