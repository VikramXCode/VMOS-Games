import { Tournament } from "../../server/models/Tournament";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  if (req.method === "GET") {
    const tournaments = await Tournament.find().sort({ status: 1, createdAt: -1 });
    res.status(200).json(tournaments);
    return;
  }

  if (req.method === "POST") {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const tournament = await Tournament.create(req.body || {});
    res.status(201).json(tournament);
    return;
  }

  methodNotAllowed(res);
}
