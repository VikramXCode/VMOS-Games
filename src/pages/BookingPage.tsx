import { useCallback, useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, History, CreditCard, Banknote, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBooking } from "@/contexts/BookingContext";

const BookingPage = () => {
  const { consoles, getAvailability } = useBooking();
  const [selectedConsole, setSelectedConsole] = useState<string>(consoles[0]?.id || "");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState(() => (selectedConsole ? getAvailability(format(new Date(), "yyyy-MM-dd"), selectedConsole) : []));
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isLoggedIn] = useState(false); // Mock auth state

  const dateString = useMemo(() => format(selectedDate, "yyyy-MM-dd"), [selectedDate]);

  const refreshSlots = useCallback(() => {
    if (!selectedConsole) return;
    const slots = getAvailability(dateString, selectedConsole);
    setTimeSlots(slots);
    setLastRefreshed(new Date());
  }, [dateString, getAvailability, selectedConsole]);

  useEffect(() => {
    refreshSlots();
  }, [refreshSlots]);

  useEffect(() => {
    const interval = setInterval(() => refreshSlots(), 30000);
    return () => clearInterval(interval);
  }, [refreshSlots]);

  const getStatusStyles = (available: boolean) => {
    return available
      ? "bg-accent/20 border-accent text-accent hover:bg-accent/30 cursor-pointer"
      : "bg-destructive/20 border-destructive text-destructive cursor-not-allowed";
  };

  const handleSlotClick = (slotId: string, available: boolean) => {
    if (available) {
      setSelectedSlot(selectedSlot === slotId ? null : slotId);
    }
  };

  const selectedConsoleMeta = consoles.find((c) => c.id === selectedConsole);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-2xl md:text-3xl font-bold">
              Book a <span className="text-primary">Slot</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Reserve your gaming session
            </p>
          </div>
          {isLoggedIn && (
            <Button variant="outline" size="sm">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          )}
        </div>

        {/* Selection Controls */}
        <div className="glass-card rounded-xl p-4 mb-6 space-y-4">
          {/* Console Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Console</label>
            <Select
              value={selectedConsole}
              onValueChange={(val) => {
                setSelectedConsole(val);
                setSelectedSlot(null);
              }}
            >
              <SelectTrigger className="w-full bg-input border-border">
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

          {/* Date Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-input border-border",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
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

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-green-500/15 text-green-400 px-2 py-1 font-semibold uppercase tracking-wide">Live</span>
          <span>Last updated {format(lastRefreshed, "hh:mm:ss a")}</span>
          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={refreshSlots}>
            <Radio className="h-3 w-3" /> Refresh
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-accent/20 border border-accent" />
            <span className="text-sm text-muted-foreground">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive/20 border border-destructive" />
            <span className="text-sm text-muted-foreground">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 border border-muted" />
            <span className="text-sm text-muted-foreground">Not Available</span>
          </div>
        </div>

        {/* Time Slots Grid */}
        <div className="glass-card rounded-xl p-4 mb-6">
          <h2 className="font-heading text-lg font-semibold mb-4">
            Select Time Slot
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => handleSlotClick(slot.id, slot.available)}
                disabled={!slot.available}
                className={cn(
                  "py-3 px-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  getStatusStyles(slot.available),
                  selectedSlot === slot.id && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {slot.start} - {slot.end}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Summary & Payment */}
        {selectedSlot && selectedConsoleMeta && selectedDate && (
          <div className="glass-card rounded-xl p-4">
            <h2 className="font-heading text-lg font-semibold mb-4">
              Booking Summary
            </h2>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Console:</span>
                <span>{selectedConsoleMeta.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>
                  {timeSlots.find((s) => s.id === selectedSlot)?.start} - {timeSlots.find((s) => s.id === selectedSlot)?.end}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-primary pt-2 border-t border-border">
                <span>Price (1 hour):</span>
                <span>₹{selectedConsoleMeta.price}</span>
              </div>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
              <Button variant="neon" className="w-full" size="lg">
                <CreditCard className="h-5 w-5" />
                Pay Online
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Banknote className="h-5 w-5" />
                Pay at Counter
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BookingPage;
