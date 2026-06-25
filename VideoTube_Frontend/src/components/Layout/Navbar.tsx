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
};
