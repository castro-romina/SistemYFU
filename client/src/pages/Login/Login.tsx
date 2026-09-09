import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "../../components/auth/RoleSelector";
import SocialAuth from "../../components/auth/SocialAuth";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
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
      navigate("/", { state: { notice: `Welcome back, ${user.name}` } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't sign you in.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="auth-shell">
    <main className="auth-card" aria-labelledby="login-title">
      <header className="auth-heading">
        <Link className="auth-brand" to="/" aria-label="MatchVol, home">Match<span>Vol</span></Link>
        <h1 id="login-title">Welcome to <strong>MatchVol</strong></h1>
        <p>Sign in to continue</p>
      </header>
      <form onSubmit={handleSubmit} className="auth-form">
        <TextField id="login-email" label="Email address" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        <TextField id="login-password" label="Password" type="password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        <RoleSelector value={role} onChange={setRole} />
        {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Signing in..." : "Sign in"}</Button>
      </form>
      <a className="auth-forgot" href="mailto:support@matchvol.com">Forgot your password?</a>
      <SocialAuth />
      <p className="auth-switch">Don't have an account? <Link to="/register">Sign up</Link></p>
    </main>
  </div>;
}
