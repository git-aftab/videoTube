import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Video, Mail, Lock, User, Image as ImageIcon, ArrowRight, Loader2, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const avatarInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === 'avatar') {
      setAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    } else {
      setCoverImage(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.email || !formData.fullName || !formData.password || !avatar) {
      return toast.error('Please fill all required fields and upload an avatar');
    }

    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      data.append('avatar', avatar);
      if (coverImage) {
        data.append('coverImage', coverImage);
      }

      await register(data);
      toast.success('Registration successful! Please check your email to verify.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-dark)] relative overflow-hidden p-4 py-12">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-xl z-10">
        <div className="glass-panel p-8 rounded-2xl animate-fade-in">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl mb-4 shadow-lg shadow-purple-500/30">
              <Video className="w-6 h-6 text-white" />
            </Link>
            <h1 className="text-2xl font-bold text-white mb-2">Create an account</h1>
            <p className="text-[var(--color-text-secondary)] text-sm">Join VideoTube to upload and share videos</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Cover Image Upload */}
            <div className="relative w-full h-32 rounded-xl overflow-hidden bg-[var(--color-surface-dark)] border border-dashed border-[var(--color-border-dark)] group cursor-pointer" onClick={() => coverInputRef.current?.click()}>
              {coverPreview ? (
                <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                  <ImageIcon className="w-6 h-6 mb-1" />
                  <span className="text-xs">Upload Cover Image (Optional)</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
              <input type="file" className="hidden" ref={coverInputRef} onChange={(e) => handleFileChange(e, 'cover')} accept="image/*" />
            </div>

            {/* Avatar Upload */}
            <div className="flex justify-center -mt-16 relative z-10 mb-4">
              <div className="relative group cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[var(--color-background-dark)] bg-[var(--color-surface-dark)]">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 group-hover:text-purple-400 transition-colors">
                      <User className="w-8 h-8" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity border-4 border-transparent">
                  <Upload className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-purple-600 text-white p-1.5 rounded-full shadow-lg">
                  <Upload className="w-3 h-3" />
                </div>
                <input type="file" className="hidden" ref={avatarInputRef} onChange={(e) => handleFileChange(e, 'avatar')} accept="image/*" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">Full Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><User className="w-4 h-4 text-gray-500" /></div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-400 ml-1">Username *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><span className="text-gray-500 font-bold">@</span></div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                    placeholder="johndoe"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="w-4 h-4 text-gray-500" /></div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-400 ml-1">Password *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Lock className="w-4 h-4 text-gray-500" /></div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-xl py-2 pl-9 pr-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl py-2.5 mt-4 font-medium flex items-center justify-center gap-2 hover:from-purple-500 hover:to-indigo-500 focus:ring-2 focus:ring-purple-500/50 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-purple-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
