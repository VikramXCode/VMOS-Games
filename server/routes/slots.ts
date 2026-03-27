import { Router, Request, Response } from "express";
import { SlotOverride } from "../models/SlotOverride.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// GET overrides for a date (public — for slot availability)
router.get("/overrides", async (req: Request, res: Response) => {
  try {
    const { date, consoleId } = req.query;
    if (!date) { res.status(400).json({ error: "date is required" }); return; }
    const filter: Record<string, unknown> = { date, blocked: true };
    if (consoleId) filter.consoleId = consoleId;
    const overrides = await SlotOverride.find(filter);
    res.json(overrides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch overrides" });
  }
});

// POST create override (admin only)
router.post("/overrides", authMiddleware, async (req: Request, res: Response) => {
  try {
    const override = await SlotOverride.create(req.body);
    res.status(201).json(override);
  } catch (err) {
    res.status(400).json({ error: "Failed to create override" });
  }
});

// DELETE override (admin only)
router.delete("/overrides/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    await SlotOverride.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete override" });
  }
});

export const slotRoutes = router;
