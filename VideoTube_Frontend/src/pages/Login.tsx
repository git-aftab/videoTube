import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Play } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/auth.context";
import api, { API_BASE_URL } from "../services/axios";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setformData] = useState({ email: "", password: "" });
  const [showPassword, setshowPassword] = useState(false);
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("runnign the login");
    e.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter the email and password");
      return;
    }

    if (formData.password.length < 6) {
      setError("The password must be atleast 6 character.");
      return
    }
    setisLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/login", formData);
      const { user } = response.data.data;
      login(user);
      navigate("/");
    } catch (error: any) {
      setError(error.response?.data?.message || "Something went Wrong");
    } finally {
      setisLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-(--bg-primary)" />

      {/* Purple glow top-left */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* Purple glow bottom-right */}
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-accent opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className=" relative z-10 w-full max-w-md bg-(--bg-secondary) border border-border rounded-2xl p-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg shadow-accent/30">
            <Play size={16} fill="white" color="white"></Play>
          </div>
          <span className=" font-syne font-bold text-xl text-(--text-primary) tracking-tight">
            VideoTube
          </span>
        </div>

        <h1 className="text-3xl font-bold text-(--text-primary) mb-2">
          Welcome,
        </h1>
        <p className="text-(--text-muted) text-sm mb-8">
          Sign in to your account to continue
        </p>

        {/* Error handle */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-(--error)/10 border border-(--error)/30 text-(--error) text-sm rounded-xl px-4 py-3 mb-6"
          >
            {error}
          </motion.div>
        )}

        {/* Form  */}
        <form onSubmit={handleSubmit} className="space-y-2">
          {/* email */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
              Email
            </label>
            <div className="relative">
              <Mail
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />
              <input
                type="email"
                name="email"
                placeholder="johndoe@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-(--bg-elevated) border border-border rounded-xl pl-10 pr-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-muted)/70 focus:outline-none focus:border-accent transition-colors duration-200"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-(--text-muted) uppercase tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs text-accent hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-(--text-muted)"
              />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                required
                className="w-full bg-(--bg-elevated) border border-border rounded-xl pl-10 pr-11 py-3 text-sm text-(--text-primary) placeholder:text-(--text-muted)/70 focus:outline-none focus:border-accent transition-colors duration-200"
              />

              <button
                type="button"
                onClick={() => setshowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-primary) transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            type="button"
            disabled={isLoading}
            className="w-full bg-accent hover:bg-(--accent-hover) disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200 shadow-lg shadow-accent/20 mt-2 py-3 cursor-pointer"
          >
            {isLoading ? "Sign in..." : "Sign in"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-(--text-muted)">or continue with</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-(--bg-elevated) hover:bg-(--bg-elevated)/70 border border-border hover:border-(--text-muted)/30 text-(--text-primary) font-medium rounded-xl py-3 text-sm transition-all duration-200 cursor-pointer"
        >
          <FcGoogle size={24} className="mr-5" />
          <span className="">Continue with Google</span>
        </button>

        {/* Register Link */}
        <p className="text-center text-sm text-(--text-muted) mt-8">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-accent hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
