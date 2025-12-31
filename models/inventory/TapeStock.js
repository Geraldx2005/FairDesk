import mongoose from "mongoose";

const tapeStockSchema = new mongoose.Schema(
  {
    tape: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tape",
      required: true,
      index: true,
    },

    location: {
      type: String,
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1, // inward only
    },

    remarks: {
      type: String,
      trim: true,
    },
    tapeFinish: {
      type: String,
      enum: ["MATTE", "GLOSSY"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/* ================= EXPORT ================= */
export default mongoose.models.TapeStock || mongoose.model("TapeStock", tapeStockSchema);
