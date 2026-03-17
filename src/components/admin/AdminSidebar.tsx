import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  BookOpenCheck,
  CalendarRange,
  Home,
  LayoutGrid,
  ShoppingBag,
  Trophy,
  Users,
  Lightbulb,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/admin/overview", label: "Overview", icon: LayoutGrid },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpenCheck },
  { to: "/admin/slots", label: "Slots", icon: CalendarRange },
  { to: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/insights", label: "AI Insights", icon: Lightbulb },
];

export const AdminSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdmin();

  return (
    <aside className="border-r border-border/60 bg-sidebar-background/80 backdrop-blur-md">
      <div className="h-16 flex items-center px-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <div>
            <p className="font-heading text-lg">VMOS Admin</p>
            <p className="text-xs text-muted-foreground">Control center</p>
          </div>
        </div>
      </div>

      <nav className="py-4 space-y-1">
        {links.map((link) => {
          const isActive = location.pathname.startsWith(link.to);
          return (
            <Link key={link.to} to={link.to} className="block px-3">
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-all",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "hover:bg-muted/40 text-muted-foreground"
                )}
              >
                <link.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{link.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 mt-auto pb-6">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={() => {
            logout();
            navigate("/admin/login");
          }}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
