import { SlotOverride } from "../../../server/models/SlotOverride";
import { connectDatabase } from "../../_lib/db";
import { requireAdmin } from "../../_lib/auth";
import { getQueryParam, handleCors, methodNotAllowed } from "../../_lib/http";
import type { ApiRequest, ApiResponse } from "../../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;

  await connectDatabase();

  if (req.method === "GET") {
    const date = getQueryParam(req, "date");
    const consoleId = getQueryParam(req, "consoleId");

    if (!date) {
      res.status(400).json({ error: "date is required" });
      return;
    }

    const filter: Record<string, unknown> = { date, blocked: true };
    if (consoleId) filter.consoleId = consoleId;

    const overrides = await SlotOverride.find(filter);
    res.status(200).json(overrides);
    return;
  }

  if (req.method === "POST") {
    const adminId = requireAdmin(req, res);
    if (!adminId) return;

    const override = await SlotOverride.create(req.body || {});
    res.status(201).json(override);
    return;
  }

  methodNotAllowed(res);
}
