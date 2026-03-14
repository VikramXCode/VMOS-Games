import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

export const AdminGuard = () => {
  const { isAuthenticated } = useAdmin();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admindashboard" state={{ from: location.pathname }} replace />;
  }

  return <Outlet />;
};
