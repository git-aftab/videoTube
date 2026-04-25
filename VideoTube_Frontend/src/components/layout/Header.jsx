import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Menu, Search, Video, Bell, User as UserIcon, LogOut } from 'lucide-react';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 lg:px-6 glass sticky top-0 z-50 border-b border-[var(--color-border-dark)]">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-[var(--color-surface-hover)] rounded-full transition-colors hidden sm:block">
          <Menu className="w-6 h-6 text-[var(--color-text-secondary)]" />
        </button>
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            VideoTube
          </span>
        </Link>
      </div>

      <div className="flex-1 max-w-2xl px-4 ml-8 mr-4 hidden md:block">
        <form onSubmit={handleSearch} className="flex relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search videos..."
            className="w-full bg-[var(--color-surface-dark)] border border-[var(--color-border-dark)] rounded-l-full py-2 px-6 focus:outline-none focus:border-purple-500/50 focus:bg-[var(--color-surface-hover)] transition-all placeholder:text-gray-500 text-sm"
          />
          <button 
            type="submit"
            className="px-6 bg-[var(--color-surface-hover)] border border-l-0 border-[var(--color-border-dark)] rounded-r-full hover:bg-gray-800 transition-colors flex items-center justify-center group"
          >
            <Search className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </button>
        </form>
      </div>

      <div className="flex items-center gap-3">
        {currentUser ? (
          <>
            <button className="p-2 hover:bg-[var(--color-surface-hover)] rounded-full transition-colors hidden sm:block relative">
              <Bell className="w-5 h-5 text-[var(--color-text-secondary)]" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-purple-500 rounded-full border border-[var(--color-background-dark)]"></span>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 hover:bg-[var(--color-surface-hover)] p-1.5 rounded-full transition-all border border-transparent hover:border-[var(--color-border-dark)]"
              >
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-purple-500/30" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
                    {currentUser.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 glass-panel rounded-xl py-2 shadow-2xl z-50 border border-[var(--color-border-dark)] animate-fade-in">
                  <div className="px-4 py-3 border-b border-[var(--color-border-dark)]/50">
                    <p className="text-sm font-medium text-white truncate">{currentUser.fullName}</p>
                    <p className="text-xs text-gray-400 truncate">@{currentUser.username}</p>
                  </div>
                  <div className="py-1">
                    <Link 
                      to={`/channel/${currentUser._id}`}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserIcon className="w-4 h-4" />
                      Your Channel
                    </Link>
                  </div>
                  <div className="border-t border-[var(--color-border-dark)]/50 py-1">
                    <button 
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link 
              to="/login"
              className="px-4 py-2 text-sm font-medium text-white hover:text-purple-400 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              to="/register"
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
