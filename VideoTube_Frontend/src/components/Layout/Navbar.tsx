import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Menu,
  icons,
  Icon,
} from "lucide-react";

import { useAuth } from "../../contexts/auth.context";

const NAV_LINKS = [
  { label: "Home", path: "/", icon: Home },
  { label: "Subscription", path: "/subscription", icon: Tv2 },
];

const MOBILE_NAV = [
  { label: "Home", path: "/", icon: Home },
  { label: "Subscription", path: "/subscription", icon: Tv2 },
  { label: "Upload", path: "/upload", icon: Upload },
  { label: "Profile", path: "/profile", icon: User },
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
    <nav className="sticky top-0 z-50 w-full bg-(--bg-primary)/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
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
          className="hidden md:flex flex-1 max-w-md items-center bg-(--bg-elevated) border border-border rounded-xl overflow-hidden focus-within:border-accent transition-colors duration-200"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Videos..."
            className="px-4 py-2.5 flex-1 bg-transparent text-sm text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
          />
          <button className="px-4 py-2.5 text-(--text-muted) hover:text-accent transition-colors">
            <Search size={16} />{" "}
          </button>
        </form>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Mobile search Toggle */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className="md:hidden p-2 text-(--text-muted) hover:text-(--text-primary) transition-colors"
          >
            <Search size={20} />
          </button>

          {/* Nav links -desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${isActive(path) ? "text-accent bg-(--accent-soft)" : "text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-elevated)"}`}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}
          </div>

          {isAuthenticated && (
            <Link
              to="/upload"
              className="hidden md:flex items-center gap-2 bg-accent hover:bg-(--accent-hover) text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors duration-200 shadow-lg shadow-accent/20"
            >
              <Upload size={15} />
              Upload
            </Link>
          )}

          {/* Auth - Avatar or sign in */}
          {isAuthenticated && (
            <div className="relative">
              <button
                className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-accent transition-all duration-200"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {user?.avatar ? (<img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover "/>) : (
                  <div className=""></div>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
