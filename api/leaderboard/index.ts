import { LeaderboardEntry } from "../../server/models/LeaderboardEntry";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  if (req.method === "GET") {
    const entries = await LeaderboardEntry.find().sort({ score: -1 }).limit(20);
    const ranked = entries.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1,
    }));
    res.status(200).json(ranked);
    return;
  }

  if (req.method === "POST") {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const entry = await LeaderboardEntry.create(req.body || {});
    res.status(201).json(entry);
    return;
  }

  methodNotAllowed(res);
}
