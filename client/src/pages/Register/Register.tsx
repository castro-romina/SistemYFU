import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "../../components/auth/RoleSelector";
import SocialAuth from "../../components/auth/SocialAuth";
import Button from "../../components/common/Button"; 
import TextField from "../../components/common/TextField";
import { register as executeRegister, register, type AccountRole } from "../../lib/api"
import "./Register.css";

export default function Register() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialRole: AccountRole = params.get("role") === "ngo" ? "organization" : "volunteer";
  const [role, setRole] = useState<AccountRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) return setError("Email addresses do not match.");
    if (password !== confirmPassword) return setError("Passwords do not match.");
    if (!acceptedTerms) return setError("You must accept the terms and privacy policy.");

    const user = await register({ name, email, password, role });
localStorage.setItem("matchvol-user", JSON.stringify(user));

if (user.role === "organization") {
  navigate("/onboarding-organization");
} else {
  navigate("/Onboarding");
}
  }

  return (
    <div className="auth-shell">
      <main className="auth-card auth-card--register" aria-labelledby="register-title">
        <header className="auth-heading flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg" />
            <span className="font-display font-bold text-3xl tracking-tight">
              <span className="text-purple-600">Match</span>
              <span className="text-pink-500">Vol</span>
            </span>
          </div>
          <h1 id="register-title" className="text-xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-sm text-[#4B4560]">It's fast, easy, and free</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <RoleSelector value={role} onChange={setRole} />
          
          <TextField 
            id="register-name" 
            label={role === "organization" ? "Organization name" : "Username"} 
            type="text" 
            placeholder={role === "organization" ? "Your organization name" : "Your name"} 
            value={name} 
            onChange={(event) => setName(event.target.value)} 
            autoComplete="name" 
            required 
          />
          
          <div className="auth-fields-row flex flex-col sm:flex-row gap-4">
            <TextField id="register-email" label="Email address" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
            <TextField id="register-email-confirm" label="Confirm email" type="email" placeholder="example@email.com" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} autoComplete="email" required />
          </div>
          
          <TextField id="register-password" label="Password" type="password" placeholder="Minimum 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
          <TextField id="register-password-confirm" label="Confirm password" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
          
          <label className="auth-terms flex items-start gap-2 text-sm text-gray-600 cursor-pointer my-2">
            <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} className="mt-1" />
            <span>
              I accept the <Link to="/terms" className="hover:underline text-pink-500 font-semibold">Terms and conditions</Link> and the <Link to="/privacy" className="hover:underline text-pink-500 font-semibold">Privacy policy</Link>
            </span>
          </label>
          
          {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
          
          <Button 
            type="submit" 
            disabled={isSubmitting} 
            style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
            className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
          >
            {isSubmitting ? "Creating account..." : "Create your account"}
          </Button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        
        <SocialAuth />
        
        <p className="auth-switch text-sm text-center mt-6">
          Already have an account? <Link to="/login" className="text-pink-500 font-bold hover:underline ml-1">Sign in</Link>
        </p>
      </main>
    </div>
  );
}
