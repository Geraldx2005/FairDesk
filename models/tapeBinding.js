import mongoose from "mongoose";

const tapeBindingSchema = new mongoose.Schema(
  {
    /* ================= REFERENCES ================= */
    tapeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tape",
      required: true,
    },

    /* ================= CLIENT ================= */
    clientName: {
      type: String,
      required: true,
      trim: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    userContact: {
      type: String,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    /* ================= TAPE SNAPSHOT ================= */
    tapeProductId: {
      type: String,
      required: true,
    },

    tapePaperCode: {
      type: String,
      required: true,
    },

    tapePaperType: {
      type: String,
      required: true,
    },

    tapeGsm: {
      type: Number,
      required: true,
    },

    tapeWidth: {
      type: Number,
      required: true,
    },

    tapeMtrs: {
      type: Number,
      required: true,
    },

    tapeCoreId: {
      type: Number,
      required: true,
    },

    tapeFinish: {
      type: String,
      enum: ["MATTE", "GLOSSY"],
      required: true,
    },

    /* ================= CLIENT OVERRIDES ================= */
    tapeClientPaperCode: {
      type: String,
      required: true,
    },

    clientTapeGsm: {
      type: Number,
      required: true,
    },

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
    },

    tapeCreditTerm: {
      type: String,
    },

    /* ================= STATUS ================= */
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("TapeBinding", tapeBindingSchema);
