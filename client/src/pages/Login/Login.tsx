import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "../../components/auth/RoleSelector";
import SocialAuth from "../../components/auth/SocialAuth";
import Button from "../../components/common/Button"; 
import TextField from "../../components/common/TextField";
import { login, type AccountRole } from "../../lib/api";
import "./Login.css";

export default function Login() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initialRole: AccountRole = params.get("role") === "ngo" ? "organization" : "volunteer";
  const [role, setRole] = useState<AccountRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const user = await login({ email, password, role });
      localStorage.setItem("matchvol-user", JSON.stringify(user));
      navigate("/InProgress", { state: { notice: `Welcome back, ${user.name}` } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't sign you in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <main className="auth-card" aria-labelledby="login-title">
        <header className="auth-heading flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg" />
            <span className="font-display font-bold text-3xl tracking-tight">
              <span className="text-purple-600">Match</span>
              <span className="text-pink-500">Vol</span>
            </span>
          </div>
          <p className="text-sm text-[#4B4560] text-center font-medium">Sign in to continue</p>
        </header>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <TextField id="login-email" label="Email address" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          <TextField id="login-password" label="Password" type="password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
          <RoleSelector value={role} onChange={setRole} />
          {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
          
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
              className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </Button>
        </form>
        
        <a className="auth-forgot text-pink-500 hover:text-pink-600 font-medium" href="mailto:support@matchvol.com">Forgot your password?</a>
        
        <div className="auth-divider">
          <span>or continue with</span>
        </div>
        
        <SocialAuth />
        
        <p className="auth-switch">
          Don't have an account? <Link to="/register" className="text-pink-500 font-bold hover:underline ml-1">Sign up</Link>
        </p>
      </main>
    </div>
  );
}
