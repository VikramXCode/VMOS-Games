import { Booking } from "../../server/models/Booking";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { getQueryParam, handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

const isMongoDuplicateKeyError = (error: unknown): error is { code: number } => {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
};

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  if (req.method === "GET") {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const date = getQueryParam(req, "date");
    const consoleId = getQueryParam(req, "consoleId");
    const filter: Record<string, unknown> = {};
    if (date) filter.date = date;
    if (consoleId) filter.consoleId = consoleId;

    const bookings = await Booking.find(filter).sort({ date: -1, startTime: 1 });
    res.status(200).json(bookings);
    return;
  }

  if (req.method === "POST") {
    try {
      const booking = await Booking.create(req.body || {});
      res.status(201).json(booking);
      return;
    } catch (err: unknown) {
      if (isMongoDuplicateKeyError(err)) {
        res.status(409).json({ error: "Slot already booked" });
        return;
      }
      res.status(400).json({ error: "Failed to create booking" });
      return;
    }
  }

  methodNotAllowed(res);
}
