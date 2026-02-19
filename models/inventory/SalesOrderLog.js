import mongoose from "mongoose";

const salesOrderLogSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TapeSalesOrder",
      required: true,
      index: true,
    },

    action: {
      type: String,
      enum: ["CREATED", "CONFIRMED", "CANCELLED", "DELIVERED"],
      required: true,
    },

    invoiceNumber: {
      type: String,
      trim: true,
    },

    quantity: {
      type: Number,
    },

    cancelReason: {
      type: String,
      trim: true,
    },

    performedBy: {
      type: String,
      default: "SYSTEM",
    },

    performedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.SalesOrderLog || mongoose.model("SalesOrderLog", salesOrderLogSchema);
