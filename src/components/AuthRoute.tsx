/* eslint-disable react-hooks/exhaustive-deps */
import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

interface AuthRouteProps {
  children: ReactNode;
}

const AuthRoute = ({ children }: AuthRouteProps) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

  useEffect(() => {
    // Hanya tampilkan toast jika mengakses route auth dan sudah login
    if (isAuthenticated && authRoutes.includes(location.pathname)) {
      toast("You are already logged in", {
        icon: "ℹ️",
        id: "already-logged-in",
      });
    }
  }, [isAuthenticated, location.pathname]);

  if (isAuthenticated && authRoutes.includes(location.pathname)) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  return children;
};

export default AuthRoute;