import { createContext, useContext, useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { api } from "@/lib/api";

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
  addBooking: (input: BookingInput) => Promise<Booking>;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  deleteBooking: (id: string) => void;
  getAvailability: (date: string, consoleId: string) => TimeSlotData[];
  getAdminSlotStates: (date: string, consoleId: string) => AdminSlotState[];
  toggleSlotBlocked: (date: string, consoleId: string, slotId: string) => void;
  blockAllSlots: (date: string, consoleId: string) => void;
  unblockAllSlots: (date: string, consoleId: string) => void;
}

const BookingContext = createContext<BookingContextValue | undefined>(undefined);

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


const mapConsole = (item: Record<string, unknown>): ConsoleType => ({
  id: item.key || item.id,
  name: String(item.name || ""),
  price: Number(item.price) || 0,
  icon: String(item.icon || "🎮"),
});

const mapBooking = (item: Record<string, unknown>): Booking => {
  const hour = Number(String(item.startTime || "10:00").split(":")[0]) || 10;
  return {
    id: item._id || item.id,
    name: String(item.customerName || ""),
    phone: String(item.customerPhone || ""),
    consoleId: String(item.consoleId || ""),
    consoleName: String(item.consoleName || ""),
    date: String(item.date || ""),
    slots: [{
      id: `slot-${hour}`,
      start: String(item.startTime || ""),
      end: String(item.endTime || ""),
      hour,
      available: false,
    }],
    amount: Number(item.price) || 0,
    status: (item.status as Booking["status"]) || "pending",
    createdAt: item.createdAt || formatISO(new Date()),
  };
};

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [consoles, setConsoles] = useState<ConsoleType[]>([]);
  const [slotOverrides, setSlotOverrides] = useState<SlotOverride[]>([]);

  useEffect(() => {
    api.consoles.list().then((items) => setConsoles(items.map(mapConsole))).catch(() => setConsoles([]));
  }, []);

  useEffect(() => {
    const token = window.localStorage.getItem("vmos-admin-token");
    if (!token) {
      setBookings([]);
      return;
    }
    api.bookings.list().then((items) => setBookings(items.map(mapBooking))).catch(() => setBookings([]));
  }, []);

  const addBooking = async (input: BookingInput): Promise<Booking> => {
    const consoleMeta = consoles.find((c) => c.id === input.consoleId);
    const firstSlot = input.slots[0];
    const payload = {
      customerName: input.name,
      customerPhone: input.phone,
      consoleId: input.consoleId,
      consoleName: consoleMeta?.name || input.consoleId,
      date: input.date,
      startTime: firstSlot?.start,
      endTime: firstSlot?.end,
      price: consoleMeta?.price || 0,
    };
    const created = await api.bookings.create(payload);
    const mapped = mapBooking(created);
    setBookings((prev) => [mapped, ...prev]);
    return mapped;
  };

  const updateBookingStatus = (id: string, status: Booking["status"]) => {
    api.bookings.update(id, { status }).then((updated) => {
      const mapped = mapBooking(updated);
      setBookings((prev) => prev.map((b) => (b.id === id ? mapped : b)));
    }).catch(() => undefined);
  };

  const deleteBooking = (id: string) => {
    api.bookings.delete(id)
      .then(() => setBookings((prev) => prev.filter((b) => b.id !== id)))
      .catch(() => undefined);
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

  const value: BookingContextValue = {
    bookings,
    consoles,
    addBooking,
    updateBookingStatus,
    deleteBooking,
    getAvailability,
    getAdminSlotStates,
    toggleSlotBlocked,
    blockAllSlots,
    unblockAllSlots,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
};
