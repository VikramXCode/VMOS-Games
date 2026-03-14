import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useBooking } from "@/contexts/BookingContext";
import { format } from "date-fns";

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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <StatCard title="Today's Bookings" value={todaysBookings.length.toString()} />
        <StatCard title="Today's Revenue" value={`₹${revenueToday}`} />
        <StatCard title="Total Bookings" value={bookings.length.toString()} />
        <StatCard title="Top Console" value={popularConsole || "-"} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {bookings.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between border-b border-border/60 pb-2 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{b.name}</p>
                <p className="text-muted-foreground text-xs">
                  {b.consoleName} • {b.date} • {b.slots.map((s) => s.start).join(", ")}
                </p>
              </div>
              <span className="text-primary font-semibold">₹{b.amount}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

const StatCard = ({ title, value }: { title: string; value: string }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-heading">{value}</p>
    </CardContent>
  </Card>
);
