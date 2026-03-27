import { Router, Request, Response } from "express";
import { Admin } from "../models/Admin.js";
import { generateToken, authMiddleware, type AuthRequest } from "../middleware/auth.js";

type AdminDocumentLike = {
  _id: { toString(): string };
  username: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
};

const isMongoDuplicateKeyError = (error: unknown): error is { code: number } => {
  return typeof error === "object" && error !== null && "code" in error && (error as { code?: unknown }).code === 11000;
};

const router = Router();

// POST login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    console.log("[Admin Login] Received login request for username:", username);
    
    if (!username || !password) {
      console.log("[Admin Login] Missing credentials");
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    console.log("[Admin Login] Looking up admin with username:", username);
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.error("[Admin Login] Admin not found for username:", username);
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    console.log("[Admin Login] Admin found, comparing passwords");
    const isValid = await (admin as unknown as AdminDocumentLike).comparePassword(password);
    if (!isValid) {
      console.error("[Admin Login] Password comparison failed for username:", username);
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    console.log("[Admin Login] Login successful for username:", username);
    const token = generateToken(admin._id.toString());
    res.json({
      token,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error("[Admin Login] Server error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// GET verify token (check if current token is still valid)
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) {
      res.status(404).json({ error: "Admin not found" });
      return;
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ error: "Failed to verify" });
  }
});

// POST create admin (superadmin only, or first admin)
router.post("/register", async (req: Request, res: Response) => {
  try {
    const count = await Admin.countDocuments();
    // Allow first admin without auth, subsequent need superadmin
    if (count > 0) {
      // Should have auth header with superadmin token
      res.status(403).json({ error: "Contact superadmin to register" });
      return;
    }

    const { username, password } = req.body;
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
});

export const adminRoutes = router;
