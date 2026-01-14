import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true }, // Investor ref
  userId: { type: String, required: true }, // e.g. TFX5001
  investment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Investment",
    required: true,
  }, // Investment ref
  investmentId: { type: String, required: true }, // e.g. INV5001-1
  paidMonthNo: { type: Number },
  returnDate: { type: Date },
  paidAMT: { type: Number },
  paidAt: { type: Date },
  paymentType: { type: String },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plans", required: true },
});

export const TransactionModel = mongoose.model(
  "Transactions",
  TransactionSchema
);
