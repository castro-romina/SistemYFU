import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState, type InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string };

export default function TextField({ label, error, type = "text", id, ...props }: TextFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const Icon = isPassword ? LockKeyhole : type === "email" ? Mail : UserRound;
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <label className="auth-field" htmlFor={id}>
      <span>{label}</span>
      <span className="auth-input-wrap">
        <Icon aria-hidden="true" size={19} />
        <input id={id} type={inputType} {...props} />
        {isPassword && <button type="button" className="auth-password-toggle" aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>}
      </span>
      {error && <small className="auth-field-error">{error}</small>}
    </label>
  );
}
