import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useBooking } from "@/contexts/BookingContext";
import { Input } from "@/components/ui/input";
import { CalendarDays, Gamepad2 } from "lucide-react";
import { api } from "@/lib/api";

type SlotState = {
  id: string;
  start: string;
  end: string;
  state: "available" | "blocked" | "booked";
};

type SlotOverride = {
  _id?: string;
  id?: string;
  startTime?: string;
};

const buildSlots = (bookedSlots: string[], blockedStartTimes: string[], blockedAllDay: boolean): SlotState[] => {
  const booked = new Set(bookedSlots);
  const blocked = new Set(blockedStartTimes);
  const slots: SlotState[] = [];
  for (let hour = 10; hour < 22; hour++) {
    const start = `${hour.toString().padStart(2, "0")}:00`;
    const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
    let state: SlotState["state"] = "available";
    if (booked.has(start)) state = "booked";
    else if (blockedAllDay || blocked.has(start)) state = "blocked";
    slots.push({ id: `slot-${hour}`, start, end, state });
  }
  return slots;
};

export const AdminSlotsPage = () => {
  const { consoles } = useBooking();
  const [consoleId, setConsoleId] = useState(consoles[0]?.id ?? "");
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [overrides, setOverrides] = useState<SlotOverride[]>([]);
  const holdTimerRef = useRef<number | null>(null);

  const blockedStartTimes = useMemo(() => overrides.map((o) => o.startTime).filter(Boolean), [overrides]);
  const blockedAllDay = useMemo(() => overrides.some((o) => !o.startTime), [overrides]);
  const slots = useMemo(() => buildSlots(bookedSlots, blockedStartTimes, blockedAllDay), [bookedSlots, blockedStartTimes, blockedAllDay]);

  const loadData = useCallback(() => {
    if (!consoleId) return;
    Promise.all([
      api.bookings.availability(date, consoleId),
      api.slots.overrides(date, consoleId),
    ])
      .then(([availability, overridesList]) => {
        setBookedSlots(availability.bookedSlots || []);
        setOverrides((overridesList || []) as SlotOverride[]);
      })
      .catch(() => {
        setBookedSlots([]);
        setOverrides([]);
      });
  }, [consoleId, date]);

  useEffect(() => {
    if (consoles.length > 0 && !consoleId) setConsoleId(consoles[0].id);
  }, [consoles, consoleId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSingleSlot = async (startTime: string, state: SlotState["state"]) => {
    if (!consoleId || state === "booked") return;
    const existing = overrides.find((o) => o.startTime === startTime);
    if (existing) {
      await api.slots.deleteOverride(existing._id || existing.id);
    } else {
      await api.slots.createOverride({ consoleId, date, startTime, blocked: true });
    }
    loadData();
  };

  const applyBulk = (nextState: "block" | "unblock") => {
    Promise.all(bulkSelected.map(async (id) => {
      const slot = slots.find((s) => s.id === id);
      if (!slot || slot.state === "booked") return;
      if (nextState === "block" && slot.state === "available") {
        await api.slots.createOverride({ consoleId, date, startTime: slot.start, blocked: true });
      }
      if (nextState === "unblock" && slot.state === "blocked") {
        const existing = overrides.find((o) => o.startTime === slot.start);
        if (existing) await api.slots.deleteOverride(existing._id || existing.id);
      }
    })).finally(() => {
      setBulkSelected([]);
      setBulkMode(false);
      loadData();
    });
  };

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
            <Button
              variant="outline"
              className="rounded-xl h-10"
              onClick={() => {
                if (!consoleId) return;
                api.slots.createOverride({ consoleId, date, blocked: true }).then(loadData);
              }}
            >
              Block full day
            </Button>
            <Button
              variant="secondary"
              className="rounded-xl h-10"
              onClick={() => {
                const fullDay = overrides.filter((o) => !o.startTime);
                Promise.all(fullDay.map((o) => api.slots.deleteOverride(o._id || o.id))).then(loadData);
              }}
            >
              Unblock full day
            </Button>
          </div>

          {bulkMode && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 flex flex-wrap items-center gap-2">
              <p className="text-xs text-primary font-semibold">Bulk mode ({bulkSelected.length} selected)</p>
              <Button size="sm" className="rounded-lg" onClick={() => applyBulk("block")}>Block Selected</Button>
              <Button size="sm" variant="secondary" className="rounded-lg" onClick={() => applyBulk("unblock")}>Unblock Selected</Button>
              <Button size="sm" variant="ghost" className="rounded-lg" onClick={() => { setBulkMode(false); setBulkSelected([]); }}>Exit</Button>
            </div>
          )}

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
                    if (bulkMode) {
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev.filter((id) => id !== slot.id) : [...prev, slot.id]);
                      return;
                    }
                    void toggleSingleSlot(slot.start, slot.state);
                  }}
                  onMouseDown={() => {
                    holdTimerRef.current = window.setTimeout(() => {
                      if (slot.state === "booked") return;
                      setBulkMode(true);
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev : [...prev, slot.id]);
                    }, 500);
                  }}
                  onMouseUp={() => {
                    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
                  }}
                  onTouchStart={() => {
                    holdTimerRef.current = window.setTimeout(() => {
                      if (slot.state === "booked") return;
                      setBulkMode(true);
                      setBulkSelected((prev) => prev.includes(slot.id) ? prev : [...prev, slot.id]);
                    }, 500);
                  }}
                  onTouchEnd={() => {
                    if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current);
                  }}
                  disabled={slot.state === "booked"}
                  className={`p-3.5 rounded-xl border text-sm text-left transition-colors ${
                    slot.state === "available"
                      ? "border-green-500/50 bg-green-500/10 hover:bg-green-500/15"
                      : slot.state === "blocked"
                      ? "border-red-500/50 bg-red-500/10 hover:bg-red-500/15"
                      : "border-muted bg-muted/40 cursor-not-allowed"
                  } ${
                    bulkSelected.includes(slot.id) ? "ring-2 ring-primary" : ""
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
