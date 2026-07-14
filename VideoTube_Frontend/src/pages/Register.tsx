import { motion } from "framer-motion";
import {
  AtSign,
  Eye,
  EyeOff,
  Mail,
  Play,
  Upload,
  User,
  Lock,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/axios";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  icon: Icon,
  rightElement,
  value,
  onChange,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
  icon: React.ElementType;
  rightElement?: React.ReactNode;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
      {label}
    </label>
    <div className="relative">
      <Icon
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full bg-[var(--bg-elevated)] border border-[var(--border)] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors duration-200"
      />
      {rightElement && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightElement}
        </div>
      )}
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const hanldeAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("Avatar must be under 10MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed");
      return;
    }
    
    setAvatar(file);
    // Create a local URL for preview - no upload yet
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      setError("Please enter full name.");
      return;
    }

    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.confirmPassword.trim()
    ) {
      setError("Please enter the email and passwords.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password do not match");
      return;
    }

    if (!avatar) {
      setError("Avatar is required");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      // Multipart form -- needed for file upload
      const data = new FormData();
      data.append("fullName", formData.fullName);
      data.append("username", formData.username);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("avatar", avatar);

      await api.post("/auth/register", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Don't auto-login --> backend reqires email verification first
      navigate("/login?registered=true");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex overflow-hidden">
      {/* bg-glows */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-primary" />

      {/* Left Div */}
      <motion.div
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full lg:w-1/2 flex items-center justify-center px-8 py-12"
      >
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
              <Play size={16} fill="white" color="white" />
            </div>
            <span className="font-['Syne'] font-bold text-xl text-(--text-primary) tracking-tight">
              VideoTube
            </span>
          </div>

          <h1 className="text-(--text-primary) text-3xl m-2 font-bold ">
            Create Account
          </h1>
          <p className="text-(--text-muted) text-sm mb-8">
            Join VideoTube and Start Sharing your videos
          </p>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-(--error)/10 border border-(--erorr)/30 text-(--error) text-sm rounded-xl px-4 py-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-1.5">
            <div className="space-y-1.5">
              <label
                htmlFor=""
                className="text-xs font-medium text-(--text-muted) uppercase tracking-wider"
              >
                Avatar<span className="text-accent">*</span>
              </label>
              <div
                onClick={() => avatarRef.current?.click()}
                className="flex items-center gap-4 bg-(--bg-elevated) border border-dashed border-border hover:border-accent rounded-xl px-4 py-3 cursor-pointer transition-colors duration-200 group"
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar Preview"
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-accent"
                  />
                ) : (
                  <div className="">
                    <User size={16} className="text-(--text-muted)" />
                  </div>
                )}

                <div>
                  <p className="text-sm text-(--text-primary)">
                    {avatar ? avatar.name : "Click to upload avatar"}
                  </p>
                  <p className="text-xs text-(--text-muted)">
                    PNG, JPG, up to 5MB
                  </p>
                </div>
                <Upload
                  size={15}
                  className="ml-auto text-(--text-muted) group-hover:text-accent transition-colors"
                />
              </div>
              <input
                type="file"
                ref={avatarRef}
                accept="image/*"
                onChange={hanldeAvatarChange}
                className="hidden"
              />
            </div>

            <InputField
              label="Full Name"
              name="fullName"
              placeholder="John Doe"
              icon={User}
              value={formData.fullName}
              onChange={handleChange}
            />

            <InputField
              label="Username"
              name="username"
              placeholder="john_doe"
              value={formData.username}
              onChange={handleChange}
              icon={AtSign}
            />
            <InputField
              label="Email"
              name="email"
              placeholder="johndoe7@gmail.com"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
            />

            <InputField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setshowPassword((p) => !p)}
                  className="text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="********"
              value={formData.confirmPassword}
              onChange={handleChange}
              icon={Lock}
              rightElement={
                <button
                  type="button"
                  onClick={() => setshowConfirmPassword((p) => !p)}
                  className="text-(--text-muted) hover:text-(--text-primary) transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
              }
            />

            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className="w-full bg-accent hover:bg-(--accent-hover) disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-colors duration-200 shadow-lg shadow-accent/20 mt-2"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-(--text-muted)">
              or continue with
            </span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={() =>
              (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`)
            }
            className="w-full flex items-center justify-center gap-3 bg-(--bg-elevated) hover:bg-(--bg-elevated)/70 border border-border hover:border-(--text-muted)/30 text-(--text-primary) font-medium rounded-xl py-3 text-sm transition-all duration-200"
          >
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          {/* Login link */}
          <p className="text-center text-sm text-(--text-muted) mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-accent hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 32 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className="relative z-10 hidden lg:flex w-1/2 items-center justify-center px-12 border-l border-border"
      >
        <div className="w-full max-w-sm space-y-8">
          {/* Label */}
          <div>
            <p className="text-xs font-medium text-(--text-muted) uppercase tracking-wider mb-1">
              Live Preview
            </p>
            <h2 className="font-['Syne'] text-2xl font-bold text-(--text-primary)">
              Your profile will look like this
            </h2>
          </div>

          {/* Profile card preview */}
          <div className="bg-(--bg-secondary) border border-border rounded-2xl overflow-hidden">
            {/* Cover */}
            <div className="h-24 bg-gradient-to-br from-[var(--accent)]/30 to-[var(--bg-elevated)]" />

            {/* Avatar + info */}
            <div className="px-6 pb-6">
              <div className="-mt-8 mb-4">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover ring-4 ring-[var(--bg-secondary)]"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[var(--bg-elevated)] border-4 border-[var(--bg-secondary)] flex items-center justify-center">
                    <User size={24} className="text-[var(--text-muted)]" />
                  </div>
                )}
              </div>

              <h3 className="font-['Syne'] font-bold text-lg text-[var(--text-primary)]">
                {formData.fullName || "Your Name"}
              </h3>
              <p className="text-sm text-[var(--text-muted)] mb-4">
                @{formData.username || "username"}
              </p>

              <div className="flex gap-4">
                <div className="text-center">
                  <p className="font-['Syne'] font-bold text-lg text-[var(--text-primary)]">
                    0
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">Videos</p>
                </div>
                <div className="text-center">
                  <p className="font-['Syne'] font-bold text-lg text-[var(--text-primary)]">
                    0
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Subscribers
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hint */}
          <p className="text-xs text-[var(--text-muted)] text-center">
            Fill in the form to see your profile update in real time
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
