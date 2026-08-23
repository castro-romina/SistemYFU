import { Link, useSearchParams } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const [params] = useSearchParams();
  const role = params.get("role"); // "ngo" | "volunteer" | null

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <h1 className="font-display text-2xl font-bold mb-2">Sign Up</h1>
        <p className="text-[var(--color-text-muted)] text-sm mb-6">
          {role === "ngo" && "Creating an NGO account. Form coming soon."}
          {role === "volunteer" && "Creating a Volunteer account. Form coming soon."}
          {!role && "Registration form coming soon."}
        </p>
        <Link to="/" className="text-purple-600 text-sm font-semibold">
          &larr; Back to home
        </Link>
      </div>
    </div>
  );
}