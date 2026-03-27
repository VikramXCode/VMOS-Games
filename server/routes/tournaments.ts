import { Router, Request, Response } from "express";
import { Tournament } from "../models/Tournament.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET all tournaments
router.get("/", async (_req: Request, res: Response) => {
  try {
    const tournaments = await Tournament.find().sort({ status: 1, createdAt: -1 });
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tournaments" });
  }
});

// POST create tournament (admin only)
router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const tournament = await Tournament.create(req.body);
    res.status(201).json(tournament);
  } catch (err) {
    res.status(400).json({ error: "Failed to create tournament" });
  }
});

// PUT update tournament (admin only)
router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tournament) { res.status(404).json({ error: "Tournament not found" }); return; }
    res.json(tournament);
  } catch (err) {
    res.status(400).json({ error: "Failed to update tournament" });
  }
});

// DELETE tournament (admin only)
router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await Tournament.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete tournament" });
  }
});

export const tournamentRoutes = router;
