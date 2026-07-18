import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock, Play } from "lucide-react";
import { useResetPassword } from "../hooks/useAuthActions";

const ResetPassword = () => {
  const { resetToken } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { mutate, isPending } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!resetToken) {
      setError("Reset token is missing.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    mutate(
      { resetToken, newPassword },
      {
        onSuccess: () => navigate("/login"),
        onError: (err: any) =>
          setError(err.response?.data?.message || "Unable to reset password."),
      },
    );
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[var(--bg-primary)]">
      <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-8">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[var(--accent)] rounded-xl flex items-center justify-center">
            <Play size={16} fill="white" color="white" />
          </div>
          <span className="font-bold text-xl">VideoTube</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Create new password</h1>
        <p className="text-sm text-[var(--text-muted)] mb-6">
          Choose a new password for your account.
        </p>

        {error && (
          <p className="mb-4 rounded-xl border border-[var(--error)]/30 bg-[var(--error)]/10 px-4 py-3 text-sm text-[var(--error)]">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[newPassword, confirmPassword].map((value, index) => (
            <div key={index} className="relative">
              <Lock
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={value}
                onChange={(e) =>
                  index === 0
                    ? setNewPassword(e.target.value)
                    : setConfirmPassword(e.target.value)
                }
                placeholder={index === 0 ? "New password" : "Confirm password"}
                required
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] py-3 pl-10 pr-11 text-sm outline-none focus:border-[var(--accent)]"
              />
              {index === 0 && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          ))}

          <button
            disabled={isPending}
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Resetting..." : "Reset password"}
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

export default ResetPassword;
