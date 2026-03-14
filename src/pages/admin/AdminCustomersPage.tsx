import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBooking } from "@/contexts/BookingContext";

export const AdminCustomersPage = () => {
  const { bookings } = useBooking();
  const customers = Array.from(
    bookings.reduce((map, booking) => {
      const existing = map.get(booking.phone);
      const totalSpent = (existing?.totalSpent || 0) + booking.amount;
      const totalBookings = (existing?.totalBookings || 0) + 1;
      map.set(booking.phone, {
        name: booking.name,
        phone: booking.phone,
        totalSpent,
        totalBookings,
        lastVisit: booking.date,
      });
      return map;
    }, new Map<string, { name: string; phone: string; totalSpent: number; totalBookings: number; lastVisit: string }>)
  ).map(([, value]) => value);

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {customers.length === 0 && <p className="text-muted-foreground">No customers yet.</p>}
          {customers.map((c) => (
            <div key={c.phone} className="border border-border/60 rounded-lg p-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.phone}</p>
                <p className="text-xs text-primary">Last visit: {c.lastVisit}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">₹{c.totalSpent}</p>
                <p className="text-xs text-muted-foreground">{c.totalBookings} bookings</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
