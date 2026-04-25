import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, PlaySquare, Clock, ThumbsUp, ListVideo, Users } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Sidebar = () => {
  const { currentUser } = useAuth();

  const mainLinks = [
    { icon: <Home className="w-5 h-5" />, label: 'Home', path: '/' },
    // You could add explore/trending later
  ];

  const userLinks = currentUser ? [
    { icon: <PlaySquare className="w-5 h-5" />, label: 'Your Videos', path: `/channel/${currentUser._id}` },
    { icon: <Users className="w-5 h-5" />, label: 'Subscriptions', path: '/subscriptions' },
    { icon: <ThumbsUp className="w-5 h-5" />, label: 'Liked Videos', path: '/liked-videos' },
    { icon: <ListVideo className="w-5 h-5" />, label: 'Playlists', path: '/playlists' },
  ] : [];

  const NavItem = ({ icon, label, path }) => (
    <NavLink
      to={path}
      className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive 
          ? 'bg-gradient-to-r from-purple-500/10 to-transparent text-white font-medium border-l-2 border-purple-500' 
          : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-white border-l-2 border-transparent'}
      `}
    >
      <div className={`transition-colors duration-200`}>
        {icon}
      </div>
      <span className="text-sm truncate">{label}</span>
    </NavLink>
  );

  return (
    <aside className="w-64 bg-[var(--color-background-dark)] border-r border-[var(--color-border-dark)] h-full hidden md:flex flex-col py-4 overflow-y-auto">
      <div className="px-3 mb-2">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <NavItem key={link.path} {...link} />
          ))}
        </div>
      </div>

      {currentUser && (
        <>
          <div className="mx-4 my-2 border-t border-[var(--color-border-dark)]/50"></div>
          <div className="px-3 mb-2">
            <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">You</h3>
            <div className="space-y-1 mt-1">
              {userLinks.map((link) => (
                <NavItem key={link.path} {...link} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Login Prompt for sidebar if logged out */}
      {!currentUser && (
        <div className="mt-8 px-6 py-6 bg-[var(--color-surface-dark)]/50 mx-4 rounded-2xl border border-[var(--color-border-dark)] text-center animate-fade-in">
          <p className="text-sm text-gray-400 mb-4">Sign in to like videos, comment, and subscribe.</p>
          <NavLink 
            to="/login"
            className="inline-block px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition-colors"
          >
            Sign in
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
