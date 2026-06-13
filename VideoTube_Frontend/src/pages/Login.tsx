import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Play } from "lucide-react";
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
      {/* Bg */}
      <div className="absolute inset-0 bg-(--bg-primary)" />
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-(--accent) opacity-10 rounded-full  blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-(--accent) opacity-10 rounded-full  blur-[120px] pointer-events-none" />

      {/* Card */}
      <motion.div>
        {/* Logo */}
        <div>
          <div className=""></div>
        </div>
      </motion.div>
      <h1 className="text-white">LOGIN PAGE</h1>
    </div>
  );
};

export default Login;
