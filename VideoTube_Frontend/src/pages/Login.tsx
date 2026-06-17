import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Play } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/auth.context";
import api from "../services/axios";

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
    e.preventDefault();
    setisLoading(true);
    setError(null);

    try {
    } catch (error) {}
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[var(--bg-primary)]" />

      {/* Purple glow top-left */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[var(--accent)] opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* Purple glow bottom-right */}
      <div className="absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[var(--accent)] opacity-10 rounded-full blur-[120px] pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className=" relative z-10 w-full bg-[var(--bg-secondary)] border border-border rounded-2xl p-10"
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
        initial = {{opacity: 0, y:-8}}
        animate = {{opacity: 0, y: 0}}
        className="bg-(--error)/10 border border-(--error)/30 text-(--error) text-sm rounded-xl px-4 py-3 mb-6"
        >
          {error}
        </motion.div>
        )}

        {/* Form  */}
        <form onSubmit={handleSubmit}>

        </form>
      </motion.div>
    </div>
  );
};

export default Login;
