import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true, // one loan per employee
    },

    currentBalance: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    emi: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "CLOSED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Loan", loanSchema);
