import mongoose from "mongoose";

const slotOverrideSchema = new mongoose.Schema(
  {
    consoleId: { type: String, required: true },
    date: { type: String, required: true }, // yyyy-MM-dd
    startTime: { type: String }, // null = whole day blocked
    blocked: { type: Boolean, default: true },
  },
  { timestamps: true }
);

slotOverrideSchema.index({ consoleId: 1, date: 1 });

export const SlotOverride = mongoose.model("SlotOverride", slotOverrideSchema);
