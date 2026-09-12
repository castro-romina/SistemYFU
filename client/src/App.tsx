import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SocialAuth from "./components/auth/SocialAuth";
import AuthToggle from "./components/auth/AuthToggle";
import Terms from "./pages/Terms/Terms";
import Privacy from "./pages/Privacy/Privacy";
import ForgotPassword from "./pages/Login/ForgotPassword"; 
import InProcess from "./pages/InProgress/InProgress";
import Onboarding from "./pages/Onboarding/Onboarding";
import OnboardingStep2 from "./pages/Onboarding/OnboardingStep2";
import OnboardingStep3 from "./pages/Onboarding/OnboardingStep3";
import OnboardingStep4 from "./pages/Onboarding/OnboardingStep4";

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
    </Routes>
  );
}
