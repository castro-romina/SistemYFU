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
    </Routes>
  );
}
