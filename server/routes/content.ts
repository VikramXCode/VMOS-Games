import { Router, Request, Response } from "express";
import { SiteContent } from "../models/SiteContent.js";

const router = Router();

router.get("/public", async (_req: Request, res: Response) => {
  try {
    const content = await SiteContent.findOne().sort({ updatedAt: -1 });
    res.json(content || {});
  } catch {
    res.status(500).json({ error: "Failed to fetch site content" });
  }
});

export const contentRoutes = router;
