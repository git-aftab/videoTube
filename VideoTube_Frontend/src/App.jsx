import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/layout/MainLayout';

// Pages
// We will create these components shortly
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watch from './pages/Watch';
import Channel from './pages/Channel';
import VideoUpload from './pages/VideoUpload';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!currentUser) return <Navigate to="/login" />;
  
  return children;
};

const PublicOnlyRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>;
  if (currentUser) return <Navigate to="/" />;
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster 
          position="bottom-right" 
          toastOptions={{
            style: {
              background: '#1a1a20',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.05)',
            }
          }}
        />
        <Routes>
          {/* Public / Auth Routes */}
          <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
          <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
          
          {/* Main App Routes wrapped in Layout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="watch/:videoId" element={<Watch />} />
            <Route path="channel/:channelId" element={<Channel />} />
            <Route path="upload" element={<ProtectedRoute><VideoUpload /></ProtectedRoute>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
