import { Admin } from "../../server/models/Admin";
import { connectDatabase } from "../_lib/db";
import { generateToken } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

const isMongoDuplicateKeyError = (error: unknown): error is { code: number } => {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
};

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const count = await Admin.countDocuments();
  if (count > 0) {
    res.status(403).json({ error: "Contact superadmin to register" });
    return;
  }

  const payload = (req.body || {}) as { username?: string; password?: string };
  const { username, password } = payload;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  try {
    const admin = await Admin.create({ username, password, role: "superadmin" });
    const token = generateToken(admin._id.toString());

    res.status(201).json({
      token,
      admin: { id: admin._id, username: admin.username, role: admin.role },
    });
  } catch (err: unknown) {
    if (isMongoDuplicateKeyError(err)) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }

    res.status(400).json({ error: "Registration failed" });
  }
}
