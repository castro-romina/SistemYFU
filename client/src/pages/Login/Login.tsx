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
      navigate("/", { state: { notice: `Bienvenido/a, ${user.name}` } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No pudimos iniciar sesion.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="auth-shell">
    <main className="auth-card" aria-labelledby="login-title">
      <header className="auth-heading">
        <Link className="auth-brand" to="/" aria-label="MatchVol, inicio">Match<span>Vol</span></Link>
        <h1 id="login-title">Bienvenido a <strong>MatchVol</strong></h1>
        <p>Inicia sesion para continuar</p>
      </header>
      <form onSubmit={handleSubmit} className="auth-form">
        <TextField id="login-email" label="Correo electronico" type="email" placeholder="ejemplo@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
        <TextField id="login-password" label="Contrasena" type="password" placeholder="Tu contrasena" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required />
        <RoleSelector value={role} onChange={setRole} />
        {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Iniciando sesion..." : "Iniciar sesion"}</Button>
      </form>
      <a className="auth-forgot" href="mailto:soporte@matchvol.com">Olvidaste tu contrasena?</a>
      <SocialAuth />
      <p className="auth-switch">No tienes cuenta? <Link to="/register">Registrate</Link></p>
    </main>
  </div>;
}
