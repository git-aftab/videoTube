import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Play } from "lucide-react";
import { useForgotPassword } from "../hooks/useAuthActions";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { mutate, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");

    mutate(email, {
      onSuccess: (res) => setMessage(res.message || "Password reset mail sent."),
      onError: (err: any) =>
        setError(err.response?.data?.message || "Unable to send reset mail."),
    });
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[var(--bg-primary)] px-4">
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-[var(--accent)] opacity-10 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-[var(--accent)] opacity-10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-xl shadow-black/20">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Play size={16} fill="white" color="white" />
          </div>
          <span className="font-syne font-bold text-xl">VideoTube</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Reset password</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Enter your account email and we will send a reset link.
        </p>

        {message && (
          <p className="mb-4 rounded-xl border border-[var(--success)]/30 bg-[var(--success)]/10 px-4 py-3 text-sm text-[var(--success)]">
            {message}
          </p>
        )}
        {error && (
          <p className="mb-4 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            />
          </div>
          <button
            disabled={isPending || !email.trim()}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-6 inline-block text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
