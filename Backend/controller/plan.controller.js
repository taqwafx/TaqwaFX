import { planModel } from "../models/plan.model.js";
import { investmentModel } from "../models/investment.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


// 🧩 Create new plan
export const createPlan = asyncHandler(async (req, res) => {
  const {
    planName,
    capitalROI,
    returnROI,
    durationMonths,
    minInvestment,
    description,
  } = req.body;

  if (!planName || !returnROI || !durationMonths || !minInvestment) {
    throw new ApiError(
      400,
      "All fields are required"
    );
  }

  // check if plan already exists
  const existingPlan = await planModel.findOne({ planName });
  if (existingPlan) {
    throw new ApiError(409, "Plan with this name already exists");
  }

  const plan = await planModel.create({
    planName,
    capitalROI,
    returnROI,
    overallMROI: capitalROI + returnROI,
    durationMonths,
    minInvestment,
    description,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, plan, "Plan created successfully"));
});

// 📋 Get all plans
export const getAllPlans = asyncHandler(async (req, res) => {
  const plans = await planModel.find().sort({ createdAt: -1 });
  return res
    .status(200)
    .json(new ApiResponse(200, plans, "All plans fetched successfully"));
});


export const deletePlan = asyncHandler(async (req, res) => {
  const { planId } = req.params;

  if (!planId) throw new ApiError(400, "Plan ID is required");

  // ✅ Check if plan exists
  const plan = await planModel.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  // ✅ Check if any investor has invested in this plan
  const existingInvestment = await investmentModel.findOne({ plan: planId });
  if (existingInvestment) {
    throw new ApiError(
      400,
      "Cannot delete this plan because investors have invested in it"
    );
  }

  // ✅ Delete plan
  await planModel.findByIdAndDelete(planId);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Plan deleted successfully"));
});
