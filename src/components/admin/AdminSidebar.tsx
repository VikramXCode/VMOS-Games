import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import {
  BookOpenCheck,
  CalendarRange,
  Home,
  LayoutGrid,
  Menu,
  ShoppingBag,
  Trophy,
  Users,
  Lightbulb,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";

export const adminLinks = [
  { to: "/admin/overview", label: "Overview", icon: LayoutGrid },
  { to: "/admin/bookings", label: "Bookings", icon: BookOpenCheck },
  { to: "/admin/slots", label: "Slots", icon: CalendarRange },
  { to: "/admin/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/admin/products", label: "Products", icon: ShoppingBag },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/insights", label: "AI Insights", icon: Lightbulb },
];

interface AdminNavContentProps {
  onLinkClick?: () => void;
}

const AdminNavContent = ({ onLinkClick }: AdminNavContentProps) => {
  const location = useLocation();

  return (
    <nav className="py-4 space-y-1">
      {adminLinks.map((link) => {
        const isActive = location.pathname.startsWith(link.to);
        return (
          <Link key={link.to} to={link.to} className="block px-3" onClick={onLinkClick}>
            <div
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-xl transition-all",
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
  );
};

export const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAdmin();

  return (
    <aside className="hidden md:flex md:flex-col border-r border-border/60 bg-sidebar-background/80 backdrop-blur-md md:sticky md:top-0 md:h-screen">
      <div className="h-16 flex items-center px-4 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <div>
            <p className="font-heading text-lg">VMOS Admin</p>
            <p className="text-xs text-muted-foreground">Control center</p>
          </div>
        </div>
      </div>

      <AdminNavContent />

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

export const AdminMobileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAdmin();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden rounded-xl border-border/60">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[88vw] max-w-sm">
        <SheetHeader className="h-16 px-4 border-b border-border/60 flex items-center justify-center">
          <SheetTitle className="flex items-center gap-2 w-full">
            <Home className="h-5 w-5 text-primary" />
            <span>VMOS Admin</span>
          </SheetTitle>
        </SheetHeader>

        <div className="px-1">
          <AdminNavContent onLinkClick={() => setOpen(false)} />
        </div>

        <div className="px-4 pb-6 mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => {
              setOpen(false);
              logout();
              navigate("/admin/login");
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
