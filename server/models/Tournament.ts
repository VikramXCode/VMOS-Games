import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    game: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    entryFee: { type: Number, required: true },
    prizePool: { type: Number, required: true },
    maxSlots: { type: Number, required: true },
    filledSlots: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["upcoming", "live", "completed"],
      default: "upcoming",
    },
    icon: { type: String, default: "🎮" },
    gradient: { type: String, default: "from-cyan-500 to-blue-600" },
  },
  { timestamps: true }
);

export const Tournament = mongoose.model("Tournament", tournamentSchema);
