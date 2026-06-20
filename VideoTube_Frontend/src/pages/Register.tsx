import { motion } from "framer-motion";
import { Play, User } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface FormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Register = () => {
  const navigate = useNavigate();

  const [forData, setFormData] = useState<FormData>({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [avatar, setAvatar] = useState<File | null>();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPasswod, setshowPasswod] = useState(false);
  const [showConfirmPassword, SetshowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const avatarRef = useRef<HTMLInputElement>(null);

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
              className="bg-error/10 border border-error/30 text-error text-sm rounded-xl px-4, py-3 mb-6"
            >
              {error}
            </motion.div>
          )}

          {/* FORM */}
          <form>
            <div className="space-y-1.5">
              <label
                htmlFor=""
                className="text-xs font-medium text-(--text-muted) uppercase tracking-wider"
              >
                Avatar<span className="text-accent">*</span>
              </label>
              <div className="flex items-center gap-4 bg-(--bg-elevated) border border-dashed border-border hover:border-accent rounded-xl px-4 py-3 cursor-pointer transition-colors duration-200 group">
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

                <p className="text-sm text-(--text-primary)">
                  {avatar ? avatar.name : "Click to upload avatar"}
                </p>
                <p className="text-xs text-(--text-muted)">
                  PNG, JPG, up to 5MB
                </p>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
