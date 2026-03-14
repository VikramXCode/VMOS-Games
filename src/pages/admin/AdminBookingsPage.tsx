import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const AdminBookingsPage = () => {
  const { bookings, updateBookingStatus, deleteBooking } = useBooking();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q.length === 0 ||
        booking.name.toLowerCase().includes(q) ||
        booking.phone.toLowerCase().includes(q) ||
        booking.consoleName.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  const badgeClass = (status: "pending" | "confirmed" | "cancelled") => {
    if (status === "confirmed") return "bg-green-500/15 text-green-400 border-green-500/40";
    if (status === "cancelled") return "bg-destructive/15 text-destructive border-destructive/40";
    return "bg-yellow-500/15 text-yellow-400 border-yellow-500/40";
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer, phone, or console"
              className="md:max-w-sm"
            />
            <Select value={statusFilter} onValueChange={(value: "all" | "pending" | "confirmed" | "cancelled") => setStatusFilter(value)}>
              <SelectTrigger className="md:max-w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredBookings.map((b) => (
            <div key={b.id} className="border border-border/60 rounded-lg p-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{b.name}</p>
                  <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border ${badgeClass(b.status)}`}>
                    {b.status}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  {b.phone} • {b.consoleName} • {b.date} • {b.slots.map((s) => s.start).join(", ")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => updateBookingStatus(b.id, "confirmed")}>Confirm</Button>
                <Button size="sm" variant="secondary" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteBooking(b.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
