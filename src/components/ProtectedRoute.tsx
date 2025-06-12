import { ReactNode, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "@/store/authStore";
import { toast } from "react-hot-toast";

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
  requireAuth?: boolean;
}

const ProtectedRoute = ({
  children,
  adminOnly = false,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    if (requireAuth && !isAuthenticated) {
      toast.error("Silakan login terlebih dahulu.", { id: "auth-error" });
    } else if (adminOnly && userRole !== "ADMIN") {
      toast.error("Unauthorized access!", { id: "admin-error" });
    }
  }, [isAuthenticated, requireAuth, adminOnly, userRole]);

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && userRole !== "ADMIN") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
