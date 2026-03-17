import mongoose from "mongoose";

const leaderboardEntrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hours: { type: Number, default: 0 },
    game: { type: String, required: true },
    score: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    avatar: { type: String, default: "🎮" },
  },
  { timestamps: true }
);

export const LeaderboardEntry = mongoose.model("LeaderboardEntry", leaderboardEntrySchema);
