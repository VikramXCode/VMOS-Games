import { useMemo, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarCheck2, Search, Filter } from "lucide-react";

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
      <Card className="bg-surface-2/90 border-border/60 rounded-2xl shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <CalendarCheck2 className="h-5 w-5 text-primary" />
            All Bookings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by customer, phone, or console"
                className="pl-9 h-10 rounded-xl"
              />
            </div>
            <div className="w-full lg:w-[220px]">
              <Select value={statusFilter} onValueChange={(value: "all" | "pending" | "confirmed" | "cancelled") => setStatusFilter(value)}>
                <SelectTrigger className="h-10 rounded-xl">
                  <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
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
          </div>

          {filteredBookings.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-muted-foreground">
              No bookings found for this filter.
            </div>
          ) : (
            filteredBookings.map((b) => (
              <div key={b.id} className="border border-border/60 bg-background/30 rounded-xl p-3 sm:p-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-foreground">{b.name}</p>
                    <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full border ${badgeClass(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs sm:text-sm break-words">
                    {b.phone} • {b.consoleName} • {b.date} • {b.slots.map((s) => s.start).join(", ")}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-2 w-full lg:w-auto">
                  <Button size="sm" variant="outline" className="rounded-lg" onClick={() => updateBookingStatus(b.id, "confirmed")}>Confirm</Button>
                  <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => updateBookingStatus(b.id, "cancelled")}>Cancel</Button>
                  <Button size="sm" variant="destructive" className="rounded-lg" onClick={() => deleteBooking(b.id)}>Delete</Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
