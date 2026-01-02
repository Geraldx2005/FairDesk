import mongoose from "mongoose";

const _create = mongoose.Model.create;

const tapeSchema = new mongoose.Schema(
  {
    /* ================= IDENTIFICATION ================= */
    tapeProductId: {
      type: String, // FS | Tape | 000001
      required: true,
      unique: true,
      trim: true,
    },

    /* ================= MATERIAL SPECS ================= */
    tapePaperCode: {
      type: String,
      required: true,
      trim: true,
    },

    tapeGsm: {
      type: Number,
      required: true,
    },

    tapePaperType: {
      type: String,
      required: true,
      trim: true,
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
      enum: [0.5, 1, 3],
      required: true,
    },

    tapeFinish: {
      type: String,
      enum: ["MATTE", "GLOSSY", "CLEAR"],
      required: true,
    },

    tapeAdhesiveGsm: {
      type: String,
      required: true,
    },

    /* ================= AUDIT ================= */
    createdBy: {
      type: String,
      default: "SYSTEM",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Tape || mongoose.model("Tape", tapeSchema);

