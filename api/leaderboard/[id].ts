import { LeaderboardEntry } from "../../server/models/LeaderboardEntry";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  await connectDatabase();

  const id = (req.query?.id && (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)) || "";
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  if (req.method === "PUT") {
    const entry = await LeaderboardEntry.findByIdAndUpdate(id, req.body || {}, { new: true });
    if (!entry) {
      res.status(404).json({ error: "Entry not found" });
      return;
    }

    res.status(200).json(entry);
    return;
  }

  if (req.method === "DELETE") {
    await LeaderboardEntry.findByIdAndDelete(id);
    res.status(200).json({ success: true });
    return;
  }

  methodNotAllowed(res);
}
