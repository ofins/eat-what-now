import { useAuth } from "@ofins/client";
import React from "react";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  redirectTo = "/",
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth(); // Assuming useAuth is a custom hook that provides authentication status

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
