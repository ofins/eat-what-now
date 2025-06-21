import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";

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
  const { isLoggedIn } = useAuth(); // Assuming useAuth is a custom hook that provides authentication status

  if (requireAuth && !isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && isLoggedIn) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
