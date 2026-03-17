import { Tournament } from "../../server/models/Tournament";
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
    const tournament = await Tournament.findByIdAndUpdate(id, req.body || {}, { new: true });
    if (!tournament) {
      res.status(404).json({ error: "Tournament not found" });
      return;
    }
    res.status(200).json(tournament);
    return;
  }

  if (req.method === "DELETE") {
    await Tournament.findByIdAndDelete(id);
    res.status(200).json({ success: true });
    return;
  }

  methodNotAllowed(res);
}
