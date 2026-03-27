import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

interface AdminContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

const TOKEN_KEY = "vmos-admin-token";

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const token = window.localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        await api.admin.me();
        setIsAuthenticated(true);
      } catch {
        window.localStorage.removeItem(TOKEN_KEY);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    void verify();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      console.log("[AdminContext] Attempting login with username:", username);
      const data = await api.admin.login(username, password);
      console.log("[AdminContext] Login successful:", data);
      window.localStorage.setItem(TOKEN_KEY, data.token);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("[AdminContext] Login failed:", error);
      if (error instanceof Error) {
        console.error("[AdminContext] Error message:", error.message);
      }
      setIsAuthenticated(false);
      return false;
    }
  };

  const logout = () => {
    window.localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  };

  const value = useMemo(() => ({ isAuthenticated, isLoading, login, logout }), [isAuthenticated, isLoading]);

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};
