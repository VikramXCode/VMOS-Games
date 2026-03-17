import jwt from "jsonwebtoken";
import type { ApiRequest, ApiResponse } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "vmos_game_station_secret_key_2026";

export const generateToken = (id: string): string => jwt.sign({ id }, JWT_SECRET, { expiresIn: "7d" });

export const requireAdmin = (req: ApiRequest, res: ApiResponse): string | null => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    return decoded.id;
  } catch {
    res.status(401).json({ error: "Invalid token" });
    return null;
  }
};
