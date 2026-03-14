import { createContext, useContext, useMemo, useState } from "react";

interface AdminContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "password";

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return window.sessionStorage.getItem("vmos-admin") === "true";
  });

  const login = (username: string, password: string) => {
    const ok = username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      window.sessionStorage.setItem("vmos-admin", "true");
      setIsAuthenticated(true);
    }
    return ok;
  };

  const logout = () => {
    window.sessionStorage.removeItem("vmos-admin");
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
