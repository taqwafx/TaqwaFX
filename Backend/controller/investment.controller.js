import { investmentModel } from "../models/investment.model.js";
import { planModel } from "../models/plan.model.js";
import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { addMonthsSafe } from "../utils/helper.js";
import mongoose from "mongoose"



// Create Investment
export const createInvestment = asyncHandler(async (req, res) => {
  const {
    userId,
    capital,
    planId,
    returnROI,
    startDate,
    bankName,
    bankHolderName,
    bankAcNumber,
    bankIFSCCode,
  } = req.body;

  if (!userId) {
    throw new ApiError(400, "Something went wrong!");
  }

  if (!capital || !planId || !returnROI) {
    throw new ApiError(400, "all fileds are required");
  }

  const user = await userModel.find({ userId });
  if (!user) throw new ApiError(404, "Investor not found");

  const plan = await planModel.findById(planId);
  if (!plan) throw new ApiError(404, "Plan not found");

  const roi = Number(returnROI) + Number(plan.capitalROI); // monthly %
  const durationMonths = plan.durationMonths;
  const sDate = startDate ? new Date(startDate) : new Date();

  // monthly profit (simple percentage of capital)
  const monthlyProfit = (Number(capital) * Number(returnROI)) / 100;

  // build monthlyReturns array
  const monthlyReturns = [];
  let remainingCapital =
    Number(monthlyProfit) * Number(plan.durationMonths) + Number(capital);

  for (let i = 1; i <= durationMonths; i++) {
    // repayment date: i months after startDate
    const returnDate = addMonthsSafe(sDate, i);

    // default policy: capital returned only on last month
    let capitalReturn = (Number(capital) * plan.capitalROI) / 100;
    const profitReturn = (Number(capital) * Number(returnROI)) / 100;
    const totalReturn = capitalReturn + profitReturn;
    remainingCapital = Number(remainingCapital) - Number(totalReturn);

    if (plan.capitalROI === 0 && i === durationMonths) {
      capitalReturn = capital;
      remainingCapital = remainingCapital - capital;
    }

    // const capitalReturn = i === durationMonths ? +capital : 0;

    monthlyReturns.push({
      monthNo: i,
      returnDate,
      capitalReturn,
      profitReturn,
      totalReturn,
      remainingBalance: +remainingCapital, // capital remaining after this month payment (before marking paid)
      status: "pending",
      paymentType: "",
      paymentProof: "",
    });
  }

  const endDate = addMonthsSafe(sDate, durationMonths);
  const overallReturn = monthlyProfit * plan.durationMonths + Number(capital);

  // generate investmentId (you can swap to your ID generator)
  const investorIdNumb = userId?.replace("TFX", "");
  const lastInvestment = await investmentModel
    .findOne({ userId })
    .sort({ investmentId: -1 })
    .limit(1);

  let nextSubNum = 0; // start at 1 by default

  if (lastInvestment && lastInvestment.investmentId) {
    // Example: INV5001-3 → get the number after the hyphen
    const parts = lastInvestment.investmentId.split("-");
    const lastSubNum = parseInt(parts[1]);
    nextSubNum = lastSubNum;
  }

  const investmentId = `INV${investorIdNumb}-${nextSubNum + 1}`;

  const investment = await investmentModel.create({
    user: user[0]?._id,
    userId: userId,
    investmentId,
    capital,
    plan: planId,
    roi,
    startDate: sDate,
    endDate,
    status: "Active",
    overallReturn,
    capitalReturnTillDate: 0,
    profitReturnTillDate: 0,
    TotalPaidTillDate: 0,
    durationMonths,
    bankName,
    bankHolderName,
    bankAcNumber,
    bankIFSCCode,
    monthlyReturns,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, investment, "Investment created successfully"));
});

export const getInvestmentDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Determine if id is MongoId or userId
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { investmentId: id };

  // find the investment and populate plan for name/roi
  const investment = await investmentModel
    .findOne(query)
    .populate("plan", "planName capitalROI durationMonths")
    .lean();

  if (!investment) {
    throw new ApiError(404, "Investment not found");
  }

  // calculate next repayment date (first pending month)
  const repaymentOn =
    investment.monthlyReturns?.find((m) => m.status === "pending")
      ?.returnDate || null;

  // prepare response
  const formatted = {
    investmentId: investment.investmentId,
    capital: investment.capital,
    planType: investment.plan?.planName || "N/A",
    roi: investment.roi,
    startFrom: investment.startDate,
    endFrom: investment.endDate,
    repaymentOn,
    status: investment.status,
    overallReturn: investment.overallReturn,
    capitalReturnTillDate: investment.capitalReturnTillDate,
    profitReturnTillDate: investment.profitReturnTillDate,
    totalPaidTillDate: investment.TotalPaidTillDate,
    bankName: investment.bankName,
    bankHolderName: investment.bankHolderName,
    bankAcNumber: investment.bankAcNumber,
    bankIFSCCode: investment.bankIFSCCode,
    monthlyReturns: investment.monthlyReturns || [],
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, formatted, "Investment details fetched successfully")
    );
});

// Mark month paid
export const markMonthPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { monthNo, paymentType, paymentProof } = req.body;

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { investmentId: id };

  // find the investment and populate plan for name/roi
  const investment = await investmentModel.findOne(query);

  if (!investment) {
    throw new ApiError(404, "Investment not found");
  }

  const monthIndex = investment.monthlyReturns.findIndex(
    (m) => m.monthNo === +monthNo
  );
  if (monthIndex === -1)
    throw new ApiError(404, "Month not found for this investment");

  const unpaidBefore = investment.monthlyReturns
    .slice(0, monthIndex)
    .some((m) => m.status === "pending");

  if (unpaidBefore) {
    throw new ApiError(
      400,
      "Please clear previous pending months before marking this as paid"
    );
  }

  const month = investment.monthlyReturns[monthIndex];

  if (month.status === "paid")
    throw new ApiError(400, "This month is already marked paid");

  // update month entry
  month.status = "paid";
  month.paymentType = paymentType || month.paymentType;
  month.paymentProof = paymentProof || month.paymentProof;

  // update cumulative fields
  investment.profitReturnTillDate = +(
    (investment.profitReturnTillDate || 0) + (month.profitReturn || 0)
  );
  investment.capitalReturnTillDate = +(
    (investment.capitalReturnTillDate || 0) + (month.capitalReturn || 0)
  );
  investment.TotalPaidTillDate = +(
    investment.profitReturnTillDate + investment.capitalReturnTillDate
  );

  // if all months paid => mark investment as Completed
  const allPaid = investment.monthlyReturns.every((m) => m.status === "paid");
  if (allPaid) investment.status = "Complete";

  await investment.save();

  return res
    .status(200)
    .json(new ApiResponse(200, investment, "Month marked as paid"));
});

export const getInvestorInvestments = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    throw new ApiError(400, "Investor ID is required");
  }

  const investments = await investmentModel
    .find({ user: _id })
    .populate("plan", "planName durationMonths")
    .lean();

  if (!investments || investments.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, {}, "No investments found for this investor"));
  }

  // Format response
  const formatted = investments.map((inv) => {
    const completedMonths =
      inv.monthlyReturns?.filter((m) => m.status === "paid").length || 0;

    // find next repayment date (first pending month)
    const nextRepayment =
      inv.monthlyReturns?.find((m) => m.status === "pending")?.returnDate ||
      null;

    return {
      investmentId: inv.investmentId,
      capital: inv.capital,
      planType: inv.plan?.planName || "N/A",
      roi: inv.roi,
      startFrom: inv.startDate,
      endFrom: inv.endDate,
      repaymentOn: nextRepayment,
      completedMonths,
      status: inv.status,
    };
  });

  return res
    .status(200)
    .json(new ApiResponse(200, formatted, "Investments fetched successfully"));
});