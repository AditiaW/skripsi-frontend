import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];

  if (isAuthenticated && authRoutes.includes(location.pathname)) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default AuthRoute;