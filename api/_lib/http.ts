import type { ApiRequest, ApiResponse } from "./types";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_ORIGIN_2,
].filter((origin): origin is string => Boolean(origin));

export const handleCors = (req: ApiRequest, res: ApiResponse): boolean => {
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  }

  if (req.method === "OPTIONS") {
    res.status(200).json({ ok: true });
    return true;
  }

  return false;
};

export const methodNotAllowed = (res: ApiResponse): void => {
  res.status(405).json({ error: "Method Not Allowed" });
};

export const getQueryParam = (req: ApiRequest, key: string): string | undefined => {
  const q = req.query?.[key];
  if (Array.isArray(q)) return q[0];
  if (typeof q === "string") return q;

  try {
    const parsedUrl = new URL(req.url || "", "http://localhost");
    return parsedUrl.searchParams.get(key) || undefined;
  } catch {
    return undefined;
  }
};
