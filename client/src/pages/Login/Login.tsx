import { Link } from "react-router-dom";
import "./Login.css";

export default function Login() {
  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="font-display text-2xl font-bold mb-2">Log In</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          Login form coming soon.
        </p>
        <Link to="/" className="text-purple-600 text-sm font-semibold">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}