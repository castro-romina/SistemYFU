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
    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) return setError("Los correos electronicos no coinciden.");
    if (password !== confirmPassword) return setError("Las contrasenas no coinciden.");
    if (!acceptedTerms) return setError("Debes aceptar los terminos y las politicas de privacidad.");

    setIsSubmitting(true);
    try {
      const user = await register({ name, email, password, role });
      localStorage.setItem("matchvol-user", JSON.stringify(user));
      navigate("/", { state: { notice: "Tu cuenta fue creada correctamente." } });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "No pudimos crear la cuenta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return <div className="auth-shell">
    <main className="auth-card auth-card--register" aria-labelledby="register-title">
      <header className="auth-heading">
        <Link className="auth-brand" to="/" aria-label="MatchVol, inicio">Match<span>Vol</span></Link>
        <h1 id="register-title">Crea tu cuenta</h1>
        <p>Es rapido, facil y gratis</p>
      </header>
      <form onSubmit={handleSubmit} className="auth-form">
        <RoleSelector value={role} onChange={setRole} />
        <TextField id="register-name" label={role === "organization" ? "Nombre de la organizacion" : "Usuario"} type="text" placeholder={role === "organization" ? "Nombre de tu organizacion" : "Tu nombre"} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
        <div className="auth-fields-row">
          <TextField id="register-email" label="Correo electronico" type="email" placeholder="ejemplo@correo.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required />
          <TextField id="register-email-confirm" label="Confirmar correo" type="email" placeholder="ejemplo@correo.com" value={confirmEmail} onChange={(event) => setConfirmEmail(event.target.value)} autoComplete="email" required />
        </div>
        <TextField id="register-password" label="Contrasena" type="password" placeholder="Minimo 8 caracteres" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        <TextField id="register-password-confirm" label="Confirmar contrasena" type="password" placeholder="Repite tu contrasena" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} autoComplete="new-password" minLength={8} required />
        <label className="auth-terms"><input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.target.checked)} />Acepto los <a href="#terminos">Terminos y condiciones</a> y la <a href="#privacidad">Politica de privacidad</a></label>
        {error && <p className="auth-message auth-message--error" role="alert">{error}</p>}
        <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creando cuenta..." : "Crear tu cuenta"}</Button>
      </form>
      <SocialAuth />
      <p className="auth-switch">Ya tienes cuenta? <Link to="/login">Inicia sesion</Link></p>
    </main>
  </div>;
}
