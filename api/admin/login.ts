import { Admin } from "../../server/models/Admin";
import { connectDatabase } from "../_lib/db";
import { generateToken } from "../_lib/auth";
import { handleCors, methodNotAllowed } from "../_lib/http";
import type { ApiRequest, ApiResponse } from "../_lib/types";

type AdminDocumentLike = {
  _id: { toString(): string };
  username: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
};

export default async function handler(req: ApiRequest, res: ApiResponse): Promise<void> {
  if (handleCors(req, res)) return;
  if (req.method !== "POST") {
    methodNotAllowed(res);
    return;
  }

  await connectDatabase();

  const payload = (req.body || {}) as { username?: string; password?: string };
  const { username, password } = payload;

  if (!username || !password) {
    res.status(400).json({ error: "Username and password required" });
    return;
  }

  const admin = await Admin.findOne({ username });
  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const isValid = await (admin as unknown as AdminDocumentLike).comparePassword(password);
  if (!isValid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = generateToken(admin._id.toString());
  res.status(200).json({
    token,
    admin: {
      id: admin._id,
      username: admin.username,
      role: admin.role,
    },
  });
}
