import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import SocialAuth from "./components/auth/SocialAuth";
import AuthToggle from "./components/AuthToggle";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/auth" element={<SocialAuth />} />
      <Route path="/toggle" element={<AuthToggle value="volunteer" onChange={() => {}} />} />
    </Routes>
  );
}