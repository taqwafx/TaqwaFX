import mongoose from "mongoose";

const monthSchema = new mongoose.Schema(
  {
    monthNo: Number,
    returnDate: Date,
    capitalReturn: { type: Number },
    profitReturn: { type: Number },
    totalReturn: { type: Number },
    remainingBalance: { type: Number },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentType: { type: String },
    paymentProof: { type: String },
  },
  { _id: false }
);

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Investor ref
  userId: { type: String, required: true }, // e.g. INVST001
  investmentId: { type: String, required: true }, // e.g. INVST001
  capital: { type: Number, required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plans", required: true },
  roi: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  repaymentDate: { type: Date },
  status: { type: String, enum: ["Active", "Complete"], default: "Active" },
  overallReturn: { type: Number },
  capitalReturnTillDate: { type: Number },
  profitReturnTillDate: { type: Number },
  TotalPaidTillDate: { type: Number },
  durationMonths: { type: Number, required: true },
  bankName: {type: String, required: true},
  bankHolderName: {type: String, required: true},
  bankAcNumber: { type: Number, required: true },
  bankIFSCCode: {type: String, required: true},
  monthlyReturns: [monthSchema],
});

export const investmentModel = mongoose.model("Investment", investmentSchema);
