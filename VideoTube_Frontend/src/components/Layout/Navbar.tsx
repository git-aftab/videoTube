import { Link } from "react-router-dom";
import { Settings, Search } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex h-16 items-center px-4">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <span className="text-red-500">▶</span>
          <span>VideoTube</span>
        </Link>

        {/* Search */}
        <div className="mx-auto w-full max-w-2xl px-8">
          <div className="flex items-center overflow-hidden rounded-full border">
            <input
              type="text"
              placeholder="Search videos..."
              className="flex-1 px-4 py-2 outline-none"
            />

            <button className="border-l px-4 py-2 hover:bg-muted">
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          {/* Settings */}
          <button className="rounded-full p-2 hover:bg-muted">
            <Settings size={22} />
          </button>

          {/* Profile */}
          <Link to="/profile/me">
            <img
              src="https://i.pravatar.cc/100"
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </Link>

        </div>
      </div>
    </header>
  );
};

export default Navbar;