import { Router, Request, Response } from "express";
import { ConsoleModel } from "../models/Console.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await ConsoleModel.find({ active: true }).sort({ order: 1, createdAt: 1 });
    res.json(items);
  } catch {
    res.status(500).json({ error: "Failed to fetch consoles" });
  }
});

export const consoleRoutes = router;
