import { Booking } from "../../server/models/Booking";
import { connectDatabase } from "../_lib/db";
import { getQueryParam, handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const date = getQueryParam(req, "date");
  const consoleId = getQueryParam(req, "consoleId");
  if (!date || !consoleId) {
    res.status(400).json({ error: "date and consoleId are required" });
    return;
  }

  const bookings = await Booking.find({
    date,
    consoleId,
    status: { $ne: "cancelled" },
  });

  res.status(200).json({ bookedSlots: bookings.map((b) => b.startTime) });
}
