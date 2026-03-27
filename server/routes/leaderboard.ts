import { Router, Request, Response } from "express";
import { LeaderboardEntry } from "../models/LeaderboardEntry.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET leaderboard (public)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const entries = await LeaderboardEntry.find().sort({ score: -1 }).limit(20);
    // Add rank
    const ranked = entries.map((entry, index) => ({
      ...entry.toObject(),
      rank: index + 1,
    }));
    res.json(ranked);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// POST create entry (admin only)
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const entry = await LeaderboardEntry.create(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: "Failed to create entry" });
  }
});

// PUT update entry (admin only)
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const entry = await LeaderboardEntry.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!entry) { res.status(404).json({ error: "Entry not found" }); return; }
    res.json(entry);
  } catch (err) {
    res.status(400).json({ error: "Failed to update entry" });
  }
});

// DELETE entry (admin only)
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await LeaderboardEntry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete entry" });
  }
});

export const leaderboardRoutes = router;
