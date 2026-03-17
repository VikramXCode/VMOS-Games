import type { ApiRequest, ApiResponse } from "./_lib/types";
import { handleCors, methodNotAllowed } from "./_lib/http";

export default function handler(req: ApiRequest, res: ApiResponse): void {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    methodNotAllowed(res);
    return;
  }

  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
}
