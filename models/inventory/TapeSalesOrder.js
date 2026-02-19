import mongoose from "mongoose";

const tapeSalesOrderSchema = new mongoose.Schema(
  {
    /* ================= REFERENCES ================= */
    tapeBinding: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TapeBinding",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Username",
      required: true,
      index: true,
    },

    tapeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tape",
      required: true,
    },

    sourceLocation: {
      type: String,
      enum: ["UNIT 1", "UNIT 2", "UNIT 3"],
    },

    /* ================= ORDER DETAILS ================= */
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    dispatchedQuantity: {
      type: Number,
      default: 0,
    },

    estimatedDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DISPATCHED", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },

    remarks: {
      type: String,
      trim: true,
    },

    /* ================= AUDIT ================= */
    createdBy: {
      type: String,
      default: "SYSTEM",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.TapeSalesOrder || mongoose.model("TapeSalesOrder", tapeSalesOrderSchema);
