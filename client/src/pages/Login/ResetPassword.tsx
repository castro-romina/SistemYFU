import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";
import { resetPassword } from "../../lib/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Missing or invalid reset link.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await resetPassword({ token, newPassword });
      setMessage(response.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not reset password.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <div className="auth-shell">
        <main className="auth-card">
          <header className="auth-heading flex flex-col items-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-1">Invalid link</h1>
            <p className="text-sm text-[#4B4560] text-center">
              This reset link is missing or invalid. Request a new one.
            </p>
          </header>
          <p className="auth-switch text-sm text-center mt-6">
            <Link to="/forgot-password" className="text-pink-500 font-bold hover:underline">
              Back to forgot password
            </Link>
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="auth-shell">
      <main className="auth-card">
        <header className="auth-heading flex flex-col items-center mb-6">
          <div className="flex items-center gap-2 mb-3 justify-center">
            <img src="/logofinal.png" alt="MatchVol" width="48" height="48" className="rounded-lg" />
            <span className="font-display font-bold text-3xl tracking-tight">
              <span className="text-purple-600">Match</span><span className="text-pink-500">Vol</span>
            </span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">Set a new password</h1>
          <p className="text-sm text-[#4B4560] text-center">Enter your new password below.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField
            id="new-password"
            label="New password"
            type="password"
            placeholder="••••••••"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <TextField
            id="confirm-password"
            label="Confirm password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          {message && <p className="text-sm text-green-600 font-semibold bg-green-50 p-2 rounded-lg text-center" role="alert">{message}</p>}
          {error && <p className="text-sm text-red-600 font-semibold bg-red-50 p-2 rounded-lg text-center" role="alert">{error}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: '#ec4899', color: '#ffffff' }}
            className="hover:bg-pink-600 font-semibold rounded-lg transition duration-200 py-3 shadow-md w-full"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </Button>
        </form>

        <p className="auth-switch text-sm text-center mt-6">
          Remember your password? <Link to="/login" className="text-pink-500 font-bold hover:underline ml-1">Sign in</Link>
        </p>
      </main>
    </div>
  );
}