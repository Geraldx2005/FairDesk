import mongoose from "mongoose";

const tapeBindingSchema = new mongoose.Schema(
  {
    /* ================= REFERENCES ================= */
    tapeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tape",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
      required: true,
    },

    /* ================= CLIENT OVERRIDES ================= */
    // Client-specific paper code (can differ from master)
    tapeClientPaperCode: {
      type: String,
      required: true,
      trim: true,
    },

    // Client-agreed GSM (can differ from master)
    clientTapeGsm: {
      type: Number,
      required: true,
    },

    // Delivered meters (if partial roll etc.)
    tapeMtrsDel: {
      type: Number,
      default: 0,
    },

    /* ================= PRICING ================= */
    tapeRatePerRoll: {
      type: Number,
      required: true,
    },

    tapeSaleCost: {
      type: Number,
      required: true,
    },

    /* ================= ORDER TERMS ================= */
    tapeMinQty: {
      type: Number,
      required: true,
    },

    tapeOdrQty: {
      type: Number,
      required: true,
    },

    tapeOdrFreq: {
      type: String,
      trim: true,
    },

    tapeCreditTerm: {
      type: String,
      trim: true,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.TapeBinding || mongoose.model("TapeBinding", tapeBindingSchema);
