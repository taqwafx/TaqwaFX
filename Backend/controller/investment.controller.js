import { investmentModel } from "../models/investment.model.js";
import { planModel } from "../models/plan.model.js";
import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { addMonthsSafe } from "../utils/helper.js";
import mongoose from "mongoose";
import { sendSMS } from "../services/sms.js";
import { TransactionModel } from "../models/Transactions.model.js";
import { uploadFileToCloudinary } from "../services/upload.service.js";

// Create Investment
export const createInvestment = asyncHandler(async (req, res) => {
  const {
    userId,
    capital,
    planId,
    returnROI,
    startDate,
    depositDate,
    depositType,
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

  // detect unknown ROI (user passed '-' exactly or trimmed)
  const roiUnknown = String(returnROI).trim() === "-";

  // compute roi (for storage) — keep null if unknown
  const roi = roiUnknown ? null : Number(returnROI) + Number(plan.capitalROI);
  const durationMonths = plan.durationMonths;
  const sDate = startDate ? new Date(startDate) : new Date();

  // monthly profit (simple percentage of capital)
  const monthlyProfit = roiUnknown
    ? 0
    : (Number(capital) * Number(returnROI)) / 100;

  // build monthlyReturns array
  const monthlyReturns = [];

  if (roiUnknown) {
    // When ROI unknown: set numeric fields to 0 (safe), and placeholders for percentages/balances
    for (let i = 1; i <= durationMonths; i++) {
      const returnDate = addMonthsSafe(sDate, i);
      let capitalReturn = 0;

      if (plan.capitalROI === 0 && i === durationMonths) {
        capitalReturn = capital;
      }

      monthlyReturns.push({
        monthNo: i,
        returnDate,
        capitalReturn,
        profitReturn: 0,
        totalReturn: 0,
        profitPercentage: 0,
        status: "pending",
        paymentType: "",
        paymentProof: "",
      });
    }
  } else {
    let remainingCapital =
      Number(monthlyProfit) * Number(plan.durationMonths) + Number(capital);

    for (let i = 1; i <= durationMonths; i++) {
      // repayment date: i months after startDate
      const returnDate = addMonthsSafe(sDate, i);

      // default policy: capital returned only on last month
      let capitalReturn = (Number(capital) * plan.capitalROI) / 100;
      let profitReturn = (Number(capital) * Number(returnROI)) / 100;
      let totalReturn = capitalReturn + profitReturn;
      remainingCapital = Number(remainingCapital) - Number(totalReturn);

      if (plan.capitalROI === 0 && i === durationMonths) {
        capitalReturn = capital;
        totalReturn += Number(capital);
        remainingCapital = remainingCapital - capital;
      }

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
  }

  const endDate = addMonthsSafe(sDate, durationMonths);
  const overallReturn = roiUnknown
    ? null
    : monthlyProfit * plan.durationMonths + Number(capital);

  // generate investmentId (you can swap to your ID generator)
  const investorIdNumb = userId?.replace("TFX", ""); //5001
  const lastInvestment = await investmentModel.aggregate([
    {
      $match: { userId },
    },
    {
      $addFields: {
        investmentNumber: {
          $toInt: {
            $arrayElemAt: [{ $split: ["$investmentId", "-"] }, 1],
          },
        },
      },
    },
    {
      $sort: { investmentNumber: -1 },
    },
    {
      $limit: 1,
    },
  ]);

  const nextInvestmentCount =
    lastInvestment.length <= 0
      ? 1
      : Number(lastInvestment[0]?.investmentNumber) + 1;
  const investmentId = `INV${investorIdNumb}-${nextInvestmentCount}`;

  // GET AFREEMENT FILE AND UPLOAD IT IN CLOUDINARY IF EXITS AFTER INV ID EXISTS
  const agreementFile = req.file;
  const newFileName = `TaqwaFX-Agreement-${investmentId}--${Date.now()}`;

  const agreementURL = await uploadFileToCloudinary(agreementFile, newFileName);

  const fristReturnDate = addMonthsSafe(sDate, 1)
  const investment = await investmentModel.create({
    user: user[0]?._id,
    userId: userId,
    investmentId,
    capital,
    plan: planId,
    roi: roiUnknown ? plan?.returnROI : roi,
    roiUnknown,
    startDate: fristReturnDate,
    endDate,
    status: "Active",
    overallReturn,
    capitalReturnTillDate: 0,
    profitReturnTillDate: 0,
    TotalPaidTillDate: 0,
    durationMonths,
    depositDate,
    depositType,
    bankName,
    bankHolderName,
    bankAcNumber,
    bankIFSCCode,
    monthlyReturns,
    agreementPath: agreementURL,
  });

  const startOn = fristReturnDate?.toISOString()?.split("T")[0];

  await sendSMS(
    `+91${user[0]?.phone}`,
    `TaqwaFX: ${user[0]?.name}, Invest Rs.${capital} in Plan ${plan?.planName} is active. 1st Payment Date: ${startOn} ID: ${investmentId}. Details: ${process.env.APP_LOGIN_SHORT_LINK}`,
  );

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

  // get Refferred User Details
  const investor = await userModel.findOne(
    { userId: investment?.userId },
    {
      referredBy: 1,
    },
  );

  let referralDetails = null;
  if (investor && investor?.referredBy?.referralId) {
    const affiliateUser = await userModel.findOne(
      {
        "affiliateIB.affiliateIBId": investor.referredBy.referralId,
      },
      {
        affiliateIB: 1,
        userId: 1,
        name: 1,
      },
    );

    referralDetails = {
      affiliateUserId: affiliateUser.userId,
      affiliateUserName: affiliateUser.name,
      affiliateUserCommision: investor?.referredBy?.referralCommission,
      bankDetails: affiliateUser.affiliateIB.bankDetails,
    };
  }

  // prepare response
  const formatted = {
    userId: investment?.userId,
    investmentId: investment.investmentId,
    capital: investment.capital,
    planType: investment.plan?.planName || "N/A",
    roi: investment.roi,
    roiUnknown: investment.roiUnknown,
    startFrom: investment.startDate,
    fristReturnDate: investment.monthlyReturns[0]?.returnDate,
    endFrom: investment.endDate,
    repaymentOn,
    status: investment.status,
    overallReturn: investment.overallReturn,
    capitalReturnTillDate: investment.capitalReturnTillDate,
    profitReturnTillDate: investment.profitReturnTillDate,
    totalPaidTillDate: investment.TotalPaidTillDate,
    depositDate: investment.depositDate,
    depositType: investment.depositType,
    bankName: investment.bankName,
    bankHolderName: investment.bankHolderName,
    bankAcNumber: investment.bankAcNumber,
    bankIFSCCode: investment.bankIFSCCode,
    monthlyReturns: investment.monthlyReturns || [],
    agreementPath: investment.agreementPath,
    referralDetails,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        formatted,
        "Investment details fetched successfully",
      ),
    );
});

// Mark month paid
export const markMonthPaid = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    monthNo,
    paymentType,
    paymentProof,
    roiUnknown,
    profit,
    commisionPaymentType,
    commisionPaymentProof,
    commision,
  } = req.body;

  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id }
    : { investmentId: id };

  // find the investment and populate plan for name/roi
  const investment = await investmentModel.findOne(query).populate("plan");

  if (!investment) {
    throw new ApiError(404, "Investment not found");
  }

  // find User
  const user = await userModel.findById(investment.user);

  const monthIndex = investment.monthlyReturns.findIndex(
    (m) => m.monthNo === +monthNo,
  );
  if (monthIndex === -1)
    throw new ApiError(404, "Month not found for this investment");

  const unpaidBefore = investment.monthlyReturns
    .slice(0, monthIndex)
    .some((m) => m.status === "pending");

  if (unpaidBefore) {
    throw new ApiError(
      400,
      "Please clear previous pending months before marking this as paid",
    );
  }

  const month = investment.monthlyReturns[monthIndex];

  if (month.status === "paid")
    throw new ApiError(400, "This month is already marked paid");

  if (roiUnknown) {
    // update month entry
    month.status = "paid";
    month.paymentType = paymentType || month.paymentType;
    month.paymentProof = paymentProof || month.paymentProof;
    month.profitReturn = profit;
    month.totalReturn = profit;
    month.profitPercentage =
      (Number(profit) / Number(investment?.capital)) * 100;

    // update cumulative fields
    investment.profitReturnTillDate = +Number(
      (investment.profitReturnTillDate || 0) + Number(profit || 0),
    );
    investment.capitalReturnTillDate = +Number(
      (investment.capitalReturnTillDate || 0) +
        Number(month.capitalReturn || 0),
    );
    investment.TotalPaidTillDate = +(
      investment.profitReturnTillDate + investment.capitalReturnTillDate
    );
  } else {
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
  }

  // if all months paid => mark investment as Completed
  const allPaid = investment.monthlyReturns.every((m) => m.status === "paid");
  if (allPaid) {
    investment.status = "Complete";

    if (roiUnknown) {
      investment.overallReturn = investment.TotalPaidTillDate;
    }

    const totalReturn = investment.monthlyReturns.reduce(
      (sum, item) => sum + Number(item.capitalReturn + item.profitReturn),
      0,
    );
    const OnDate = investment?.endDate?.toISOString()?.split("T")[0];
    await sendSMS(
      `+91${user?.phone}`,
      `TaqwaFX: Congrats, ${user?.name}! Investment complete. CR Amt: Rs. ${totalReturn} (Principal + Profit) INV ID: ${investment?.investmentId}, Plan: ${investment?.plan?.planName}. End: ${OnDate}. Thank you!`,
    );
  }

  // update referred payments details
  if (commisionPaymentProof && commisionPaymentType) {
    month.referrad = {
      totalReturn: commision,
      paymentType: commisionPaymentType,
      paymentProof: commisionPaymentProof,
    };
  }

  await investment.save();
  const returnMonth = month?.returnDate?.toISOString()?.split("T")[0];

  // create a new transaction
  TransactionModel.create({
    user: investment.user,
    userId: investment.userId,
    investment: investment._id,
    investmentId: investment.investmentId,
    invCapital: investment.capital,
    paidMonthNo: month.monthNo,
    returnDate: month.returnDate,
    paidAMT: roiUnknown ? profit : month?.totalReturn,
    paidAt: new Date(),
    paymentType: paymentType,
    plan: investment.plan._id,
    isCommiEntery: false
  });

  if (commisionPaymentProof && commisionPaymentType) {
  
    const affiliateUser = await userModel.findOne(
      {
        "affiliateIB.affiliateIBId": user?.referredBy?.referralId,
      },
      {
        _id: 1,
        userId: 1,
      },
    );

    TransactionModel.create({
      user: affiliateUser._id,
      userId: affiliateUser.userId,
      investment: investment._id,
      investmentId: investment.investmentId,
      invCapital: 0,
      paidMonthNo: month.monthNo,
      returnDate: month.returnDate,
      paidAMT: commision,
      paidAt: new Date(),
      paymentType: commisionPaymentType,
      plan: investment.plan._id,
      isCommiEntery: true
    });
  }

  await sendSMS(
    `+91${user?.phone}`,
    `TaqwaFX: Congrats, ${user?.name}! Rs.${month?.totalReturn} profit credited on ${returnMonth}. UTR: ${paymentProof}. Repayment Month: ${monthNo}. Details: ${process.env.APP_LOGIN_SHORT_LINK}`,
  );

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
      .json(new ApiResponse(200, [], "No investments found for this investor"));
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

export const getInvestorInvAcDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // 1️⃣ Find all investments of that user
  const investments = await investmentModel.find({ userId });

  // 2️⃣ Convert to ARRAY
  const InvBankDetails = investments.map((inv) => ({
    investmentId: inv.investmentId,
    bankName: inv.bankName,
    bankHolderName: inv.bankHolderName,
    bankAcNumber: inv.bankAcNumber,
    bankIFSCCode: inv.bankIFSCCode,
  }));

  // 3️⃣ Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        InvBankDetails,
        "Investor Inv Ac Details fetched successfully",
      ),
    );
});

// for upload Agreement if it is skip while creating Investment
export const uploadInvAgreement = asyncHandler(async (req, res) => {
  const { investmentId } = req.body;

  // 1️⃣ Validate input
  if (!investmentId) {
    throw new ApiError(400, "Something went wrong!");
  }

  if (!req.file) {
    throw new ApiError(400, "Something went wrong!");
  }

  // 2️⃣ Check investment exists FIRST
  const investment = await investmentModel.findOne({ investmentId });
  if (!investment) {
    throw new ApiError(400, "Something went wrong!");
  }

  // 3️⃣ Upload to Cloudinary
  const newFileName = `TaqwaFX-Agreement-${investmentId}-${Date.now()}`;
  const agreementURL = await uploadFileToCloudinary(req.file, newFileName);

  // 4️⃣ Update DB (new field if not exists)
  investment.agreementPath = agreementURL;
  await investment.save();

  // 5️⃣ Response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { agreementURL },
        "Agreement uploaded successfully!",
      ),
    );
});
