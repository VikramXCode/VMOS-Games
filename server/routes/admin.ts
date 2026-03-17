import { Router, Request, Response } from "express";
import { Admin } from "../models/Admin";
import { generateToken, authMiddleware } from "../middleware/auth";

const router = Router();

// POST login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isValid = await (admin as any).comparePassword(password);
    if (!isValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

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
    res.status(500).json({ error: "Login failed" });
  }
});

// GET verify token (check if current token is still valid)
router.get("/me", authMiddleware, async (req: any, res: Response) => {
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
  } catch (err: any) {
    if (err.code === 11000) {
      res.status(409).json({ error: "Username already exists" });
      return;
    }
    res.status(400).json({ error: "Registration failed" });
  }
});

export const adminRoutes = router;
