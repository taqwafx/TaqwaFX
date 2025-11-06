import mongoose from "mongoose";

const planSchema = new mongoose.Schema({
  planName: { type: String, required: true }, // e.g. "5+5"
  capitalROI: { type: Number, required: true }, // monthly ROI %
  returnROI: { type: Number, required: true }, // monthly ROI %
  overallMROI: { type: Number, required: true }, // monthly ROI %
  durationMonths: { type: Number, required: true },
  minInvestment: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const planModel = mongoose.model("Plans", planSchema);
