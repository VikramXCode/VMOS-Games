import { Admin } from "../../server/models/Admin";
import { connectDatabase } from "../_lib/db";
import { requireAdmin } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const adminId = requireAdmin(req, res);
  if (!adminId) return;

  const admin = await Admin.findById(adminId).select("-password");
  if (!admin) {
    res.status(404).json({ error: "Admin not found" });
    return;
  }

  res.status(200).json(admin);
}
