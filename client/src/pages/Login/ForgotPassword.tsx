import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      // 🚀 Le pega directo a tu nuevo controlador del backend (Puerto 4000)
      const response = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      setMessage("We have sent a reset link to your email registry.");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the email.");
    } finally {
      setIsSubmitting(false);
    }
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
          <h1 className="text-xl font-bold text-gray-900 mb-1">Reset your password</h1>
          <p className="text-sm text-[#4B4560] text-center">Enter your email and we'll send you a link to get back into your account.</p>
        </header>

        <form onSubmit={handleSubmit} className="auth-form">
          <TextField 
            id="forgot-email" 
            label="Email address" 
            type="email" 
            placeholder="example@email.com" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
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
            {isSubmitting ? "Sending..." : "Send reset link"}
          </Button>
        </form>

        <p className="auth-switch text-sm text-center mt-6">
          Remember your password? <Link to="/login" className="text-pink-500 font-bold hover:underline ml-1">Sign in</Link>
        </p>
      </main>
    </div>
  );
}
