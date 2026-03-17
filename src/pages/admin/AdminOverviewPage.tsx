import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useBooking } from "@/contexts/BookingContext";
import { format } from "date-fns";
import { CalendarDays, Coins, Gamepad2, ListChecks } from "lucide-react";
import type { ComponentType } from "react";

export const AdminOverviewPage = () => {
  const { bookings, consoles } = useBooking();
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysBookings = bookings.filter((b) => b.date === today);
  const revenueToday = todaysBookings.reduce((sum, b) => sum + b.amount, 0);
  const popularConsole = consoles
    .map((c) => ({
      console: c,
      count: bookings.filter((b) => b.consoleId === c.id).length,
    }))
    .sort((a, b) => b.count - a.count)[0]?.console.name;

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="text-xl font-heading font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-muted-foreground">Live summary of bookings and revenue.</p>
      </div>

      <div className="grid gap-3 grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard title="Today's Bookings" value={todaysBookings.length.toString()} icon={CalendarDays} />
        <StatCard title="Today's Revenue" value={`₹${revenueToday}`} icon={Coins} />
        <StatCard title="Total Bookings" value={bookings.length.toString()} icon={ListChecks} />
        <StatCard title="Top Console" value={popularConsole || "-"} icon={Gamepad2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="rounded-xl border border-border/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium truncate">{b.name}</p>
                <span className="text-primary font-semibold whitespace-nowrap">₹{b.amount}</span>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">
                  {b.consoleName} • {b.date} • {b.slots.map((s) => s.start).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
        <Icon className="h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-0">
      <p className="text-lg sm:text-2xl font-heading break-words">{value}</p>
    </CardContent>
  </Card>
);
