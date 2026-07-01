import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  replace,
} from "react-router-dom";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import ProtectedRoute from "./components/shared/ProtectedRoute";

// pages
import Home from "./pages/Home";
import Watch from "./pages/Watch";
import Upload from "./pages/Upload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Playlist from "./pages/Playlist";
import Profile from "./pages/Profile";

import "./App.css";
import { useAuth } from "./contexts/auth.context";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

// Root layout wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-(--bg-primary)">
    <Navbar />

    {/* This fills the space between navbar and footer */}
    <main className="flex-1 flex">{children}</main>

    <Footer />
  </div>
);

const App = () => {
  return (
    // basic concept to protected and non-protected route is VIEW - Public, Rest(Create, Uupdate,Del) - protected
    <BrowserRouter>
      <Routes>
        {/* Public Routes - public to view */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/watch/:videoId"
          element={
            <Layout>
              <Watch />
            </Layout>
          }
        />
        <Route
          path="profile/:username"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="playlists/:id"
          element={
            <Layout>
              <Playlist />
            </Layout>
          }
        />

        {/* Guest only - redirect to home if already logged in */}
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />

        {/* Protected — redirect to login if not authenticated */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Layout>
                <Upload />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Profile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
