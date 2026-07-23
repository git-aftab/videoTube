import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import {
  Play,
  Search,
  Upload,
  Home,
  Tv2,
  User,
  LogOut,
  LayoutDashboard,
  X,
  Heart,
  MessageSquareText,
  Mail,
} from "lucide-react";

import { useAuth } from "../../contexts/auth.context";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Tweets", path: "/tweets", icon: MessageSquareText },
  { label: "Subscription", path: "/subscription", icon: Tv2 },
];

const MOBILE_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "Tweets", path: "/tweets", icon: MessageSquareText },
  { label: "Subscription", path: "/subscription", icon: Tv2 },
  { label: "Upload", path: "/upload", icon: Upload },
  { label: "Profile", path: "/dashboard", icon: User },
  {label: "Email", path: '/verify-email', icon: Mail}
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.addEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    setShowMobileSearch(false);
  };

  const handleLogOut = async () => {
    setShowDropdown(false);
    await logout();
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--bg-primary)]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center shadow-lg shadow-accent/30">
            <Play size={14} fill="white" color="white" />
          </div>

          <span className="font-syne font-bold text-lg text-(--text-primary) tracking-tight hidden sm:block">
            VideoTube
          </span>
        </Link>

        {/* Search bar - hidden in mobile */}
        <form
          onSubmit={handleSearch}
          className="hidden flex-1 max-w-md items-center overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] transition-colors duration-200 focus-within:border-[var(--accent)] md:flex"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Videos..."
            className="flex-1 bg-transparent px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
          />
          <button className="px-4 py-2.5 text-[var(--text-muted)] transition-colors hover:text-[var(--accent)]">
            <Search size={16} />{" "}
          </button>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Mobile search Toggle */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="rounded-xl p-2 text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] md:hidden"
          >
            <Search size={20} />
          </button>

          {/* Nav links -desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${isActive(path) ? "bg-[var(--accent-soft)] text-[var(--accent)]" : "text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <Link
              to="/upload"
              className="hidden items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-colors duration-200 hover:bg-[var(--accent-hover)] md:flex"
            >
              <Upload size={15} />
              Upload
            </Link>
          )}

          {/* Auth - Avatar or sign in */}
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-transparent transition-all duration-200 hover:ring-[var(--accent)]"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-full h-full object-cover "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[var(--bg-elevated)]">
                    <User size={16} className="text-[var(--text-muted)]" />
                  </div>
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {showDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 1, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-56 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] shadow-xl shadow-black/30"
                  >
                    <div className="border-b border-[var(--border)] px-4 py-3">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {user?.username}
                      </p>
                    </div>

                    {/* Links */}
                    <div className="py-1">
                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <User size={15} />
                        Your Channel
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </Link>
                      <Link
                        to="/liked-videos"
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <Heart size={15} />
                        Liked Videos
                      </Link>
                      <Link
                        to='/verify-email'
                        onClick={() => {
                          setShowDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
                      >
                        <Mail size={15} />
                        Verify Email
                      </Link>
                      <button
                        onClick={handleLogOut}
                        className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--error)] transition-colors hover:bg-[var(--bg-secondary)]"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to={"/login"}
              className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] px-4 py-2 text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 hover:border-[var(--accent)]"
            >Sign in</Link>
          )}
        </div>
      </div>
    </nav>

    {/* ── Mobile fullscreen search overlay ── */}
      <AnimatePresence>
        {showMobileSearch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)] px-4 pt-6 md:hidden"
          >
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="flex flex-1 items-center overflow-hidden rounded-xl border border-[var(--accent)] bg-[var(--bg-elevated)]">
                <Search size={16} className="ml-4 shrink-0 text-[var(--text-muted)]" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowMobileSearch(false)}
                className="rounded-xl p-2 text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Mobile bottom nav ── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg-primary)]/95 backdrop-blur-md md:hidden">
        <div className="flex items-center justify-around h-16 px-2">
          {MOBILE_NAV.map(({ label, path, icon: Icon }) => {
            const active = isActive(path)
            const isUpload = label === 'Upload'

            if (isUpload) {
              return (
                <Link
                  key={path}
                  to={path}
                  className="flex flex-col items-center gap-1 p-2"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] shadow-lg shadow-accent/30">
                    <Icon size={18} color="white" />
                  </div>
                </Link>
              )
            }

            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <Icon size={20} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Bottom padding so content isn't hidden behind mobile nav */}
      {/* <div className="h-16 md:hidden" /> */}
    </>
  );
};

export default Navbar;
