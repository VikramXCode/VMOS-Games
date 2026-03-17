import { Router, Request, Response } from "express";
import { Booking } from "../models/Booking";
import { authMiddleware } from "../middleware/auth";

const router = Router();

// GET all bookings (admin only)
router.get("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { date, consoleId } = req.query;
    const filter: Record<string, unknown> = {};
    if (date) filter.date = date;
    if (consoleId) filter.consoleId = consoleId;
    const bookings = await Booking.find(filter).sort({ date: -1, startTime: 1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// GET bookings for a date+console (public — for slot availability)
router.get("/availability", async (req: Request, res: Response) => {
  try {
    const { date, consoleId } = req.query;
    if (!date || !consoleId) {
      res.status(400).json({ error: "date and consoleId are required" });
      return;
    }
    const bookings = await Booking.find({
      date: date as string,
      consoleId: consoleId as string,
      status: { $ne: "cancelled" },
    });
    const bookedSlots = bookings.map((b) => b.startTime);
    res.json({ bookedSlots });
  } catch (err) {
    res.status(500).json({ error: "Failed to check availability" });
  }
});

// POST create booking (public)
router.post("/", async (req: Request, res: Response) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Slot already booked" });
      return;
    }
    res.status(400).json({ error: "Failed to create booking" });
  }
});

// PUT update booking status (admin only)
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) { res.status(404).json({ error: "Booking not found" }); return; }
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: "Failed to update booking" });
  }
});

// DELETE booking (admin only)
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete booking" });
  }
});

export const bookingRoutes = router;
