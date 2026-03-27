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

const parseCsv = (value?: string): string[] =>
  value
    ? value
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean)
    : [];

const explicitAllowedOrigins = parseCsv(process.env.ALLOWED_ORIGINS);

const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, message: string): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(message));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
};

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:3000",
  process.env.CLIENT_ORIGIN,
  process.env.CLIENT_ORIGIN_2,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ...explicitAllowedOrigins,
].filter((origin): origin is string => Boolean(origin));

let connectPromise: Promise<typeof mongoose> | null = null;

const connectDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) {
    console.log("✅ MongoDB already connected");
    return mongoose;
  }

  if (!connectPromise) {
    console.log("🔄 Connecting to MongoDB...");
    connectPromise = withTimeout(
      mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 7000,
        connectTimeoutMS: 7000,
        socketTimeoutMS: 7000,
      }),
      10000,
      "MongoDB connect timed out"
    )
      .then((m) => {
        console.log("✅ MongoDB connection established");
        return m;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err.message);
        connectPromise = null;
        throw err;
      });
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

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📨 [${new Date().toISOString()}] ${req.method} ${req.originalUrl || req.url}`);

  res.on("finish", () => {
    console.log(`✅ [${new Date().toISOString()}] Response sent for ${req.method} ${req.originalUrl || req.url}: ${res.statusCode}`);
  });

  next();
});

app.use("/api/products", productRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/slots", slotRoutes);
app.use("/api/consoles", consoleRoutes);
app.use("/api/content", contentRoutes);

app.get("/", (_req, res) => {
  res.json({
    status: "ok",
    service: "vmos-games-backend",
    message: "Backend is running. Use /api/* endpoints.",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), mongoState: mongoose.connection.readyState });
});

// Global error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error("❌ API Error:", err.message || err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const expressHandler = serverless(app);

export default async function handler(req: Parameters<typeof expressHandler>[0], res: Parameters<typeof expressHandler>[1]) {
  try {
    console.log(`📨 ${req.method} ${req.url}`);
    await withTimeout(connectDatabase(), 12000, "Database bootstrap timed out");
    console.log("✅ Database connected, handling request");
    return await withTimeout(
      Promise.resolve(expressHandler(req, res)),
      25000,
      "Request handler timed out"
    );
  } catch (err) {
    console.error("❌ Handler error:", err instanceof Error ? err.message : String(err));
    res.status(500).json({ error: "Service is currently unavailable. Please check MongoDB connection." });
  }
}
