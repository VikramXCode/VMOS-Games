import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Radio, MessageCircle, Clock, Gamepad2, Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";
import { SlotSuggester } from "@/components/ai/SlotSuggester";
import { api } from "@/lib/api";

const BookingPage = () => {
  const { consoles } = useBooking();
  const [selectedConsole, setSelectedConsole] = useState<string>(consoles[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<Array<{ id: string; start: string; end: string; hour: number; available: boolean }>>([]);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const buildSlots = (bookedSlots: string[], blockedSlots: string[], blockedAllDay: boolean) => {
    const booked = new Set(bookedSlots);
    const blocked = new Set(blockedSlots);
    const slots = [] as Array<{ id: string; start: string; end: string; hour: number; available: boolean }>;
    for (let hour = 10; hour < 22; hour++) {
      const start = `${hour.toString().padStart(2, "0")}:00`;
      const end = `${(hour + 1).toString().padStart(2, "0")}:00`;
      slots.push({
        id: `slot-${hour}`,
        start,
        end,
        hour,
        available: !booked.has(start) && !blockedAllDay && !blocked.has(start),
      });
    }
    return slots;
  };

  const dateString = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const refreshSlots = useCallback(() => {
    if (!selectedConsole) return;
    Promise.all([
      api.bookings.availability(dateString, selectedConsole),
      api.slots.overrides(dateString, selectedConsole),
    ])
      .then(([availability, overrides]) => {
        const blockedStartTimes = (overrides || [])
          .map((override) => override.startTime)
          .filter((startTime): startTime is string => Boolean(startTime));
        const blockedAllDay = (overrides || []).some((override) => !override.startTime);

        setTimeSlots(buildSlots(availability.bookedSlots || [], blockedStartTimes, blockedAllDay));
        setLastRefreshed(new Date());
      })
      .catch(() => {
        setTimeSlots(buildSlots([], [], false));
        setLastRefreshed(new Date());
      });
  }, [dateString, selectedConsole]);

  useEffect(() => { refreshSlots(); }, [refreshSlots]);
  useEffect(() => {
    const interval = setInterval(() => refreshSlots(), 30000);
    return () => clearInterval(interval);
  }, [refreshSlots]);

  const handleSlotClick = (slotId: string, available: boolean) => {
    if (available) setSelectedSlot(selectedSlot === slotId ? null : slotId);
  };

  const selectedConsoleMeta = consoles.find((c) => c.id === selectedConsole);
  const availableSlotLabels = timeSlots.filter((slot) => slot.available).map((slot) => `${slot.start} - ${slot.end}`);
  const availableCount = timeSlots.filter((s) => s.available).length;

  const handleAiSlotSelect = (slotText: string) => {
    const matched = timeSlots.find((slot) => `${slot.start} - ${slot.end}` === slotText);
    if (matched && matched.available) setSelectedSlot(matched.id);
  };

  const handleWhatsAppBook = () => {
    if (!selectedConsoleMeta || !selectedSlot) return;
    const slot = timeSlots.find((s) => s.id === selectedSlot);
    if (!slot) return;
    const message = encodeURIComponent(
      `Hi! I'd like to book a gaming slot:\n\n🎮 Console: ${selectedConsoleMeta.name}\n📅 Date: ${format(selectedDate, "PPP")}\n⏰ Time: ${slot.start} - ${slot.end}\n💰 Price: ₹${selectedConsoleMeta.price}/hr\n\nPlease confirm!`
    );
    window.open(`https://wa.me/917010905241?text=${message}`, "_blank");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Gamepad2 className="h-5 w-5 text-primary" />
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Book a <span className="text-gradient">Slot</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">Reserve your gaming session</p>
        </div>

        {/* Step 1: Console + Date Selection */}
        <div className="rounded-2xl bg-surface-2 border border-border/50 p-5 mb-6 space-y-4 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
              <span className="font-mono font-bold text-primary text-xs">1</span>
            </div>
            <h2 className="font-heading font-semibold">Choose Console & Date</h2>
          </div>

          {/* Console */}
          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5 uppercase tracking-wider">Console</label>
            <Select
              value={selectedConsole}
              onValueChange={(val) => { setSelectedConsole(val); setSelectedSlot(null); }}
            >
              <SelectTrigger className="w-full bg-surface-3 border-border/50 rounded-xl">
                <SelectValue placeholder="Choose a console" />
              </SelectTrigger>
              <SelectContent>
                {consoles.map((console) => (
                  <SelectItem key={console.id} value={console.id}>
                    {console.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-xs font-heading text-muted-foreground mb-1.5 uppercase tracking-wider">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-surface-3 border-border/50 rounded-xl",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="pointer-events-auto"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Live Status */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3 px-1">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/15 text-accent px-2.5 py-1 font-heading font-semibold uppercase tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live
          </span>
          <span>Updated {format(lastRefreshed, "hh:mm:ss a")}</span>
          <button onClick={refreshSlots} className="flex items-center gap-1 text-primary hover:underline">
            <Radio className="h-3 w-3" /> Refresh
          </button>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 px-1">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-accent/20 border border-accent" />
            <span className="text-xs text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-destructive/20 border border-destructive" />
            <span className="text-xs text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-muted/50 border border-muted" />
            <span className="text-xs text-muted-foreground">N/A</span>
          </div>
        </div>

        {/* Step 2: Time Slots */}
        <div className="rounded-2xl bg-surface-2 border border-border/50 p-5 mb-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <span className="font-mono font-bold text-primary text-xs">2</span>
              </div>
              <h2 className="font-heading font-semibold">Select Time Slot</h2>
            </div>
            <span className="text-xs font-mono text-accent">{availableCount} available</span>
          </div>

          <SlotSuggester
            consoleName={selectedConsoleMeta?.name}
            availableSlots={availableSlotLabels}
            onSelect={handleAiSlotSelect}
          />

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
            {timeSlots.map((slot, index) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot.id, slot.available)}
                disabled={!slot.available}
                className={cn(
                  "py-3 px-2 rounded-xl border text-xs font-mono font-medium transition-all duration-200 animate-fade-in-up",
                  slot.available
                    ? "bg-accent/10 border-accent/30 text-accent hover:bg-accent/20"
                    : "bg-destructive/10 border-destructive/30 text-destructive/60 cursor-not-allowed",
                  selectedSlot === slot.id && "ring-2 ring-primary ring-offset-2 ring-offset-background bg-primary/20 border-primary text-primary"
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <Clock className="h-3 w-3 mx-auto mb-1" />
                {slot.start}
                <br />
                {slot.end}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Booking Summary */}
        {selectedSlot && selectedConsoleMeta && selectedDate && (
          <div className="rounded-2xl bg-gradient-to-b from-primary/5 to-surface-2 border border-primary/20 p-5 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/20 flex items-center justify-center">
                <Check className="h-4 w-4 text-primary" />
              </div>
              <h2 className="font-heading font-semibold">Booking Summary</h2>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Console</span>
                <span className="font-heading font-semibold">{selectedConsoleMeta.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Date</span>
                <span className="font-heading font-semibold">{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Time</span>
                <span className="font-mono font-semibold">
                  {timeSlots.find((s) => s.id === selectedSlot)?.start} – {timeSlots.find((s) => s.id === selectedSlot)?.end}
                </span>
              </div>
              <div className="border-t border-border/50 pt-3 flex justify-between items-center">
                <span className="font-heading font-semibold">Price (1 hour)</span>
                <span className="font-mono font-bold text-lg text-primary">₹{selectedConsoleMeta.price}</span>
              </div>
            </div>

            <Button
              onClick={handleWhatsAppBook}
              className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-heading font-bold py-6 rounded-xl text-base"
              size="lg"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Confirm via WhatsApp
            </Button>

            <p className="text-center text-xs text-muted-foreground/60 mt-3">
              You'll receive booking confirmation on WhatsApp
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
