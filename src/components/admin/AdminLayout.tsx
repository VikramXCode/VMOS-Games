import { AdminMobileMenu, AdminSidebar } from "@/components/admin/AdminSidebar";
import { useLocation } from "react-router-dom";

const titleFromPath = (path: string) => {
  if (path.includes("/overview")) return "Overview";
  if (path.includes("/bookings")) return "Bookings";
  if (path.includes("/slots")) return "Slots";
  if (path.includes("/tournaments")) return "Tournaments";
  if (path.includes("/products")) return "Products";
  if (path.includes("/customers")) return "Customers";
  if (path.includes("/insights")) return "AI Insights";
  return "Admin";
};

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-[280px_1fr] bg-gradient-surface">
      <AdminSidebar />

      <section className="min-w-0">
        <header className="md:hidden sticky top-0 z-20 h-16 border-b border-border/60 bg-surface-1/95 backdrop-blur-md px-4 flex items-center justify-between">
          <div>
            <p className="font-heading font-semibold text-foreground">{titleFromPath(location.pathname)}</p>
            <p className="text-xs text-muted-foreground">VMOS Admin</p>
          </div>
          <AdminMobileMenu />
        </header>

        <main className="p-4 pb-20 md:p-6 lg:p-8 overflow-y-auto max-w-7xl">{children}</main>
      </section>
    </div>
  );
};
