import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";

export const AdminSlotsPage = () => {
  const { consoles, getAdminSlotStates, toggleSlotBlocked, blockAllSlots, unblockAllSlots } = useBooking();
  const [consoleId, setConsoleId] = useState(consoles[0]?.id ?? "");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);

  const slots = consoleId ? getAdminSlotStates(date, consoleId) : [];

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Slot Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-64">
              <Select value={consoleId} onValueChange={setConsoleId}>
                <SelectTrigger>
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
              className="w-full md:w-52"
            />
            <Button variant="outline" onClick={() => blockAllSlots(date, consoleId)}>
              Block full day
            </Button>
            <Button variant="secondary" onClick={() => unblockAllSlots(date, consoleId)}>
              Unblock full day
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => {
                  if (slot.state !== "booked") {
                    toggleSlotBlocked(date, consoleId, slot.id);
                  }
                }}
                disabled={slot.state === "booked"}
                className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                  slot.state === "available"
                    ? "border-border hover:bg-muted/40"
                    : slot.state === "blocked"
                    ? "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/15"
                    : "border-destructive/50 bg-destructive/10 cursor-not-allowed"
                }`}
              >
                <p className="font-semibold">{slot.start} - {slot.end}</p>
                <p className="text-xs text-muted-foreground">
                  {slot.state === "available" ? "Available" : slot.state === "blocked" ? "Blocked by admin" : "Booked by customer"}
                </p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};
