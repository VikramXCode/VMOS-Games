import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { CalendarDays, Gamepad2 } from "lucide-react";

export const AdminSlotsPage = () => {
  const { consoles, getAdminSlotStates, toggleSlotBlocked, blockAllSlots, unblockAllSlots } = useBooking();
  const [consoleId, setConsoleId] = useState(consoles[0]?.id ?? "");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const slots = consoleId ? getAdminSlotStates(date, consoleId) : [];

  return (
    <AdminLayout>
      <Card className="bg-surface-2/90 border-border/60 rounded-2xl shadow-soft">
        <CardHeader className="pb-3">
          <CardTitle className="font-heading text-xl flex items-center gap-2">
            <Gamepad2 className="h-5 w-5 text-primary" />
            Slot Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col xl:flex-row gap-3 xl:items-center">
            <div className="w-full xl:w-72">
              <Select value={consoleId} onValueChange={setConsoleId}>
                <SelectTrigger className="h-10 rounded-xl">
                  <SelectValue placeholder="Select console" />
                </SelectTrigger>
                <SelectContent>
                  {consoles.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full xl:w-52 h-10 rounded-xl"
            />
            <Button variant="outline" className="rounded-xl h-10" onClick={() => blockAllSlots(date, consoleId)}>
              Block full day
            </Button>
            <Button variant="secondary" className="rounded-xl h-10" onClick={() => unblockAllSlots(date, consoleId)}>
              Unblock full day
            </Button>
          </div>

          {slots.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 py-8 text-center text-muted-foreground flex items-center justify-center gap-2">
              <CalendarDays className="h-4 w-4" />
              Select a console to manage slots.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => {
                    if (slot.state !== "booked") {
                      toggleSlotBlocked(date, consoleId, slot.id);
                    }
                  }}
                  disabled={slot.state === "booked"}
                  className={`p-3.5 rounded-xl border text-sm text-left transition-colors ${
                    slot.state === "available"
                      ? "border-border bg-background/30 hover:bg-muted/40"
                      : slot.state === "blocked"
                      ? "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/15"
                      : "border-destructive/50 bg-destructive/10 cursor-not-allowed"
                  }`}
                >
                  <p className="font-semibold">{slot.start} - {slot.end}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {slot.state === "available" ? "Available" : slot.state === "blocked" ? "Blocked by admin" : "Booked by customer"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
