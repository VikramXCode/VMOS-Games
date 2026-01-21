import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, History, CreditCard, Banknote } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type SlotStatus = "available" | "booked" | "unavailable";

interface TimeSlot {
  time: string;
  status: SlotStatus;
}

const consoles = [
  { value: "pc", label: "Gaming PC" },
  { value: "ps5", label: "PlayStation 5" },
  { value: "ps4", label: "PlayStation 4" },
  { value: "ps3", label: "PlayStation 3" },
  { value: "ps2", label: "PlayStation 2" },
  { value: "xbox", label: "Xbox Series X" },
];

// Mock time slots - in production this would come from a backend
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const statuses: SlotStatus[] = ["available", "booked", "unavailable"];
  
  for (let hour = 10; hour <= 22; hour++) {
    for (const minutes of ["00", "30"]) {
      const time = `${hour.toString().padStart(2, "0")}:${minutes}`;
      // Randomize status for demo
      const randomStatus = statuses[Math.floor(Math.random() * 3)];
      slots.push({ time, status: randomStatus });
    }
  }
  return slots;
};

const BookingPage = () => {
  const [selectedConsole, setSelectedConsole] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());
  const [isLoggedIn] = useState(false); // Mock auth state

  const getStatusStyles = (status: SlotStatus) => {
    switch (status) {
      case "available":
        return "bg-accent/20 border-accent text-accent hover:bg-accent/30 cursor-pointer";
      case "booked":
        return "bg-destructive/20 border-destructive text-destructive cursor-not-allowed";
      case "unavailable":
        return "bg-muted/50 border-muted text-muted-foreground cursor-not-allowed";
    }
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (slot.status === "available") {
      setSelectedSlot(selectedSlot === slot.time ? null : slot.time);
    }
  };

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
            <Select value={selectedConsole} onValueChange={setSelectedConsole}>
              <SelectTrigger className="w-full bg-input border-border">
                <SelectValue placeholder="Choose a console" />
              </SelectTrigger>
              <SelectContent>
                {consoles.map((console) => (
                  <SelectItem key={console.value} value={console.value}>
                    {console.label}
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
                key={slot.time}
                onClick={() => handleSlotClick(slot)}
                disabled={slot.status !== "available"}
                className={cn(
                  "py-3 px-2 rounded-lg border text-sm font-medium transition-all duration-200",
                  getStatusStyles(slot.status),
                  selectedSlot === slot.time && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                )}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Booking Summary & Payment */}
        {selectedSlot && selectedConsole && selectedDate && (
          <div className="glass-card rounded-xl p-4">
            <h2 className="font-heading text-lg font-semibold mb-4">
              Booking Summary
            </h2>
            <div className="space-y-2 mb-6 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Console:</span>
                <span>{consoles.find(c => c.value === selectedConsole)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span>{format(selectedDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span>{selectedSlot}</span>
              </div>
              <div className="flex justify-between font-semibold text-primary pt-2 border-t border-border">
                <span>Price (1 hour):</span>
                <span>₹100</span>
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
