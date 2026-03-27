import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import serverless from "serverless-http";
import { adminRoutes } from "../server/routes/admin.js";
import { bookingRoutes } from "../server/routes/bookings.js";
import { consoleRoutes } from "../server/routes/consoles.js";
import { contentRoutes } from "../server/routes/content.js";
import { leaderboardRoutes } from "../server/routes/leaderboard.js";
import { productRoutes } from "../server/routes/products.js";
import { slotRoutes } from "../server/routes/slots.js";
import { tournamentRoutes } from "../server/routes/tournaments.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/vmos";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_ORIGIN_2,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
].filter((origin): origin is string => Boolean(origin));

let connectPromise: Promise<typeof mongoose> | null = null;

const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectPromise) {
    connectPromise = mongoose.connect(MONGODB_URI);
  }

  return connectPromise;
};

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (same origin) or from allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      // In production on Vercel, allow the deployment domain
      if (process.env.VERCEL && origin?.includes("vercel.app")) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/consoles", consoleRoutes);
app.use("/api/content", contentRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const expressHandler = serverless(app);

export default async function handler(req: Parameters<typeof expressHandler>[0], res: Parameters<typeof expressHandler>[1]) {
  await connectDatabase();
  return expressHandler(req, res);
}
