import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth.context";
import type React from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  //   Still checking auth - don't render anything yet
  if (isLoading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg-primary)",
          color: "var(--accent)",
          fontFamily: "jetBrains Mono, monospace",
          fontSize: "14px",
        }}
      >
        Loading...
      </div>
    );
  }

//   if not logged in then redirect to login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
