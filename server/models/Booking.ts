import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerPhone: { type: String, required: true },
    consoleId: { type: String, required: true },
    consoleName: { type: String, required: true },
    date: { type: String, required: true }, // yyyy-MM-dd
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Compound index for slot uniqueness
bookingSchema.index({ consoleId: 1, date: 1, startTime: 1 }, { unique: true });

export const Booking = mongoose.model("Booking", bookingSchema);
