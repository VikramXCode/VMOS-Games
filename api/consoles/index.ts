import { ConsoleModel } from "../../server/models/Console";
import { connectDatabase } from "../_lib/db";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const consoles = await ConsoleModel.find({ active: true }).sort({ order: 1, createdAt: 1 });
  res.status(200).json(consoles);
}
