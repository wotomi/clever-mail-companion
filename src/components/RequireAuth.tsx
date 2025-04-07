
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RequireAuthProps {
  children: React.ReactNode;
}

const RequireAuth = ({ children }: RequireAuthProps) => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // While checking authentication state, show a loading screen
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // For nested routes
  if (children instanceof Array && children.find(child => child.type === Outlet)) {
    return <>{children}</>;
  }

  // For direct children
  return <>{children}</>;
};

export default RequireAuth;
