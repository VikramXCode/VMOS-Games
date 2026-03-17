import { SlotOverride } from "../../../server/models/SlotOverride";
import { connectDatabase } from "../../_lib/db";
import { requireAdmin } from "../../_lib/auth";
import { handleCors, methodNotAllowed } from "../../_lib/http";
import type { ApiRequest, ApiResponse } from "../../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  if (req.method !== "DELETE") {
    methodNotAllowed(res);
    return;
  }

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  await connectDatabase();

  const id = (req.query?.id && (Array.isArray(req.query.id) ? req.query.id[0] : req.query.id)) || "";
  if (!id) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  await SlotOverride.findByIdAndDelete(id);
  res.status(200).json({ success: true });
}
