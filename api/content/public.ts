import { SiteContent } from "../../server/models/SiteContent";
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

  const content = await SiteContent.findOne().sort({ updatedAt: -1 });
  res.status(200).json(content || {});
}
