import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import RoleSelector from "../../components/auth/RoleSelector";
import SocialAuth from "../../components/auth/SocialAuth";
import Button from "../../components/ui/Button";
import TextField from "../../components/ui/TextField";
import { register, type AccountRole } from "../../lib/api";
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

    setIsSubmitting(true);
    try {
      const user = await register({ name, email, password, role });
      localStorage.setItem("matchvol-user", JSON.stringify(user));
      navigate("/", { state: { notice: "Your account was successfully created." } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "We couldn't create your account.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="auth-shell">
    <main className="auth-card auth-card--register" aria-labelledby="register-title">
      <header className="auth-heading">
        <Link className="auth-brand" to="/" aria-label="MatchVol, home">Match<span>Vol</span></Link>
        <h1 id="register-title">Create your account</h1>
        <p>It's fast, easy, and free</p>
      </header>
      <form onSubmit={handleSubmit} className="auth-form">
        <RoleSelector value={role} onChange={setRole} />
        <TextField id="register-name" label={role === "organization" ? "Organization name" : "Username"} type="text" placeholder={role === "organization" ? "Your organization name" : "Your name"} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
        <div className="auth-fields-row">
          <TextField id="register-email" label="Email address" type="email" placeholder="example@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          <TextField id="register-email-confirm" label="Confirm email" type="email" placeholder="example@email.com" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} autoComplete="email" required />
        </div>
        <TextField id="register-password" label="Password" type="password" placeholder="Minimum 8 characters" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        <TextField id="register-password-confirm" label="Confirm password" type="password" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        
        <label className="auth-terms">
          <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />
          I accept the <Link to="/terms" className="hover:underline text-purple-600">Terms and conditions</Link> and the <Link to="/privacy" className="hover:underline text-purple-600">Privacy policy</Link>
        </label>
        
        {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating account..." : "Create your account"}</Button>
      </form>
      <SocialAuth />
      <p className="auth-switch">Already have an account? <Link to="/login">Sign in</Link></p>
    </main>
  </div>;
}
