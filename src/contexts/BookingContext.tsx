import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { addDays, formatISO, subDays } from "date-fns";

export type SlotStatus = "available" | "booked" | "unavailable";

export type ConsoleType = {
  id: string;
  name: string;
  price: number;
  icon: string;
};

export type TimeSlotData = {
  id: string;
  start: string;
  end: string;
  hour: number;
  available: boolean;
};

export type Booking = {
  id: string;
  name: string;
  phone: string;
  consoleId: string;
  consoleName: string;
  date: string; // YYYY-MM-DD
  slots: TimeSlotData[];
  amount: number;
  status: "confirmed" | "pending" | "cancelled";
  createdAt: string;
};

export type BookingInput = {
  name: string;
  phone: string;
  consoleId: string;
  date: string;
  slots: TimeSlotData[];
};

type SlotOverride = {
  date: string;
  consoleId: string;
  slotId: string;
  blocked: boolean;
};

export type AdminSlotState = TimeSlotData & {
  state: "available" | "booked" | "blocked";
};

interface BookingContextValue {
  bookings: Booking[];
  consoles: ConsoleType[];
  addBooking: (input: BookingInput) => Booking;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  deleteBooking: (id: string) => void;
  getAvailability: (date: string, consoleId: string) => TimeSlotData[];
  getAdminSlotStates: (date: string, consoleId: string) => AdminSlotState[];
  toggleSlotBlocked: (date: string, consoleId: string, slotId: string) => void;
  blockAllSlots: (date: string, consoleId: string) => void;
  unblockAllSlots: (date: string, consoleId: string) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

const CONSOLES: ConsoleType[] = [
  { id: "ps5", name: "PlayStation 5", price: 100, icon: "🎮" },
  { id: "ps4", name: "PlayStation 4", price: 80, icon: "🎮" },
  { id: "xbox", name: "Xbox Series X", price: 100, icon: "🎮" },
  { id: "pc-high", name: "Gaming PC (High-end)", price: 80, icon: "💻" },
  { id: "pc-mid", name: "Gaming PC (Mid-range)", price: 60, icon: "💻" },
  { id: "switch", name: "Nintendo Switch", price: 60, icon: "🕹️" },
  { id: "vr", name: "VR Gaming", price: 150, icon: "🥽" },
];

const generateSlots = () => {
  const slots: TimeSlotData[] = [];
  for (let hour = 10; hour < 22; hour++) {
    const startTime = `${hour.toString().padStart(2, "0")}:00`;
    const endHour = hour + 1;
    const endTime = `${endHour.toString().padStart(2, "0")}:00`;
    slots.push({
      id: `slot-${hour}`,
      start: startTime,
      end: endTime,
      hour,
      available: true,
    });
  }
  return slots;
};

const seedBookings = (): Booking[] => {
  const today = new Date();
  const consoles = CONSOLES;
  const seed: Booking[] = [];

  for (let i = 0; i < 10; i++) {
    const date = formatISO(subDays(today, Math.floor(Math.random() * 5)), { representation: "date" });
    const console = consoles[Math.floor(Math.random() * consoles.length)];
    const slotHour = 12 + Math.floor(Math.random() * 6);
    const slot: TimeSlotData = {
      id: `slot-${slotHour}`,
      start: `${slotHour.toString().padStart(2, "0")}:00`,
      end: `${(slotHour + 1).toString().padStart(2, "0")}:00`,
      hour: slotHour,
      available: false,
    };

    seed.push({
      id: `seed-${i}`,
      name: `Guest ${i + 1}`,
      phone: `99999${(10000 + i).toString().slice(-5)}`,
      consoleId: console.id,
      consoleName: console.name,
      date,
      slots: [slot],
      amount: console.price,
      status: "confirmed",
      createdAt: formatISO(addDays(today, -i)),
    });
  }

  return seed;
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useLocalStorage<Booking[]>("vmos-bookings", seedBookings());
  const [slotOverrides, setSlotOverrides] = useLocalStorage<SlotOverride[]>("vmos-slot-overrides", []);

  const addBooking = (input: BookingInput): Booking => {
    const consoleMeta = CONSOLES.find((c) => c.id === input.consoleId);
    const amount = input.slots.length * (consoleMeta?.price || 0);
    const booking: Booking = {
      id: crypto.randomUUID(),
      name: input.name,
      phone: input.phone,
      consoleId: input.consoleId,
      consoleName: consoleMeta?.name || input.consoleId,
      date: input.date,
      slots: input.slots,
      amount,
      status: "pending",
      createdAt: formatISO(new Date()),
    };
    setBookings((prev) => [booking, ...prev]);
    return booking;
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const deleteBooking = (id: string) => {
    setBookings((prev) => prev.filter((b) => b.id !== id));
  };

  const isBlocked = (date: string, consoleId: string, slotId: string) => {
    return slotOverrides.some(
      (override) =>
        override.date === date &&
        override.consoleId === consoleId &&
        override.slotId === slotId &&
        override.blocked
    );
  };

  const toggleSlotBlocked = (date: string, consoleId: string, slotId: string) => {
    setSlotOverrides((prev) => {
      const index = prev.findIndex(
        (override) =>
          override.date === date &&
          override.consoleId === consoleId &&
          override.slotId === slotId
      );

      if (index === -1) {
        return [...prev, { date, consoleId, slotId, blocked: true }];
      }

      const next = [...prev];
      if (next[index].blocked) {
        next.splice(index, 1);
      } else {
        next[index] = { ...next[index], blocked: true };
      }
      return next;
    });
  };

  const blockAllSlots = (date: string, consoleId: string) => {
    const slots = generateSlots();
    setSlotOverrides((prev) => {
      const filtered = prev.filter((override) => !(override.date === date && override.consoleId === consoleId));
      return [
        ...filtered,
        ...slots.map((slot) => ({ date, consoleId, slotId: slot.id, blocked: true })),
      ];
    });
  };

  const unblockAllSlots = (date: string, consoleId: string) => {
    setSlotOverrides((prev) => prev.filter((override) => !(override.date === date && override.consoleId === consoleId)));
  };

  const getAvailability = (date: string, consoleId: string): TimeSlotData[] => {
    const baseSlots = generateSlots();
    const taken = bookings.filter((b) => b.date === date && b.consoleId === consoleId && b.status !== "cancelled");
    const booked = new Set<string>();
    taken.forEach((b) => b.slots.forEach((s) => booked.add(s.id)));
    return baseSlots.map((slot) => {
      const blocked = isBlocked(date, consoleId, slot.id);
      return { ...slot, available: !booked.has(slot.id) && !blocked };
    });
  };

  const getAdminSlotStates = (date: string, consoleId: string): AdminSlotState[] => {
    const baseSlots = generateSlots();
    const taken = bookings.filter((b) => b.date === date && b.consoleId === consoleId && b.status !== "cancelled");
    const booked = new Set<string>();
    taken.forEach((b) => b.slots.forEach((s) => booked.add(s.id)));

    return baseSlots.map((slot) => {
      if (booked.has(slot.id)) {
        return { ...slot, available: false, state: "booked" };
      }
      if (isBlocked(date, consoleId, slot.id)) {
        return { ...slot, available: false, state: "blocked" };
      }
      return { ...slot, available: true, state: "available" };
    });
  };

  const value = useMemo(
    () => ({
      bookings,
      consoles: CONSOLES,
      addBooking,
      updateBookingStatus,
      deleteBooking,
      getAvailability,
      getAdminSlotStates,
      toggleSlotBlocked,
      blockAllSlots,
      unblockAllSlots,
    }),
    [bookings, slotOverrides]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};
