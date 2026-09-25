import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SocialAuth from "./components/auth/SocialAuth";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import GuestRoute from "./components/auth/GuestRoute";
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
import NotFound from "./pages/NotFound/NotFound";
import Settings from "./pages/Settings/Settings";

export default function App() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<SocialAuth />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute />}>
  <Route path="/InProgress" element={<InProcess />} />
  <Route path="/settings" element={<Settings />} />
</Route>

<Route path="/register" element={<Register />} />

      {/* Solo sin sesión: con sesión iniciada no se puede volver acá */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Solo voluntarios con sesión */}
      <Route element={<ProtectedRoute role="volunteer" requireOnboarding={false} />}>
        <Route path="/Onboarding" element={<Onboarding />} />
        <Route path="/Onboarding/step2" element={<OnboardingStep2 />} />
        <Route path="/Onboarding/step3" element={<OnboardingStep3 />} />
        <Route path="/Onboarding/step4" element={<OnboardingStep4 />} />
      </Route>

      {/* Solo organizaciones con sesión */}
    <Route element={<ProtectedRoute role="organization" requireOnboarding={false} />}>
        <Route path="/OnboardingOrg" element={<OrgStep1 />} />
        <Route path="/OnboardingOrg/step2" element={<OrgStep2 />} />
        <Route path="/OnboardingOrg/step3" element={<OrgStep3 />} />
        <Route path="/OnboardingOrg/step4" element={<OrgStep4 />} />
      </Route>

      {/* Cualquier usuario con sesión */}
      <Route element={<ProtectedRoute />}>
        <Route path="/InProgress" element={<InProcess />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>

   
  );
}