import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export const AdminGuard = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
