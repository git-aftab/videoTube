import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Tweets from "./pages/Tweets";
import LikedVideos from "./pages/LikedVideos";
import Health from "./pages/Health";

import "./App.css";
import { useAuth } from "./contexts/auth.context";
import EmailVerification from "./pages/EmailVerification";

const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
};

// Root layout wrapper
const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col bg-[var(--bg-primary)]">
    <Navbar />

    {/* This fills the space between navbar and footer */}
    <main className="flex-1 flex pb-16 md:pb-0">{children}</main>

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
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password/:resetToken"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/verify-email:verificationToken"
          element={
            <ProtectedRoute>
              <Layout>
                <EmailVerification />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tweets"
          element={
            <ProtectedRoute>
              <Layout>
                <Tweets />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/health"
          element={
            <ProtectedRoute>
              <Layout>
                <Health />
              </Layout>
            </ProtectedRoute>
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
          path="/liked-videos"
          element={
            <ProtectedRoute>
              <Layout>
                <LikedVideos />
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
