import { userModel } from "../models/user.model.js";
import { planModel } from "../models/plan.model.js";
import { investmentModel } from "../models/investment.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";


export const getAdminDashboard = asyncHandler(async (req, res) => {
  // 1️⃣ Total investors (case-insensitive)
  const totalInvestors = await userModel.countDocuments({
    role: { $regex: /^investor$/i },
  });

  // 2️⃣ Total investments
  const totalInvestments = await investmentModel.countDocuments();

  // 3️⃣ Total fund invested
  const totalFundData = await investmentModel.aggregate([
    { $group: { _id: null, total: { $sum: "$capital" } } },
  ]);
  const totalFund = totalFundData[0]?.total || 0;

  // 4️⃣ This month’s new investors
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthNewInvestors = await userModel.countDocuments({
    role: { $regex: /^investor$/i },
    createdAt: { $gte: startOfMonth },
  });

  // 5️⃣ Get all plans and calculate per-plan stats
  const plans = await planModel.find().lean();
  const planWiseData = [];

  for (const plan of plans) {
    const investments = await investmentModel.find({ plan: plan._id });
    const investorIds = new Set(investments.map((inv) => inv.user?.toString()));
    const totalPlanFund = investments.reduce(
      (sum, inv) => sum + (inv.capital || 0),
      0
    );

    planWiseData.push({
      planName: plan.planName,
      investorsCount: investorIds.size,
      totalFund: totalPlanFund,
    });
  }

  // 6️⃣ Top 10 investors (ranked)
  const topInvestorsData = await investmentModel.aggregate([
    {
      $group: {
        _id: "$user",
        totalCapital: { $sum: "$capital" },
        totalInvestments: { $sum: 1 },
      },
    },
    { $sort: { totalCapital: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        _id: 0,
        investorId: "$user.userId",
        name: "$user.name",
        totalCapital: 1,
        totalInvestments: 1,
      },
    },
  ]);

  const topInvestors = topInvestorsData.map((item, index) => ({
    rank: index + 1,
    investorId: item.investorId,
    name: item.name,
    totalCapital: item.totalCapital,
    totalInvestments: item.totalInvestments,
  }));

  // 7️⃣ Upcoming repayments (next 7 days)
  const today = new Date();
  const next7Days = new Date(today);
  next7Days.setDate(today.getDate() + 60);

  const upcomingRepaymentsRaw = await investmentModel.aggregate([
    { $unwind: "$monthlyReturns" },
    {
      $match: {
        "monthlyReturns.returnDate": { $gte: today, $lte: next7Days },
        "monthlyReturns.status": "pending",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "plans",
        localField: "plan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    {
      $project: {
        investorId: "$user.userId",
        name: "$user.name",
        joinDate: "$user.createdAt",
        planType: "$plan.planName",
        capital: "$capital",
        repaymentDate: "$monthlyReturns.returnDate",
        userId: "$user._id",
      },
    },
  ]);

  // 8️⃣ Group repayments by investor for total fund and investment count
  const investorMap = new Map();

  for (const repay of upcomingRepaymentsRaw) {
    const id = repay.userId.toString();
    if (!investorMap.has(id)) {
      investorMap.set(id, {
        investorId: repay.investorId,
        name: repay.name,
        joinDate: repay.joinDate,
        totalFund: 0,
        totalInvestments: 0,
        nextRepaymentDate: repay.repaymentDate,
        planType: repay.planType,
      });
    }

    const inv = investorMap.get(id);
    inv.totalFund += repay.capital;
    inv.totalInvestments += 1;

    // update next repayment date if earlier one found
    if (new Date(repay.repaymentDate) < new Date(inv.nextRepaymentDate)) {
      inv.nextRepaymentDate = repay.repaymentDate;
      inv.planType = repay.planType;
    }
  }

  const upcomingRepayments = Array.from(investorMap.values()).sort(
    (a, b) => new Date(a.nextRepaymentDate) - new Date(b.nextRepaymentDate)
  );

  // 9️⃣ Final dashboard response
  const result = {
    overallStats: {
      totalInvestors,
      totalInvestments,
      totalFund,
      thisMonthNewInvestors,
    },
    planWiseData,
    topInvestors,
    upcomingRepayments,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Admin dashboard data fetched successfully")
    );
});

export const getInvestorDashboard = asyncHandler(async (req, res) => {
  
  const { _id } = req.user;


  // 2️⃣ Find investor
  const investor = await userModel.findById(_id).lean();
  if (!investor) throw new ApiError(404, "Investor not found");

  // Fetch all plans (we’ll use this if investor has 0 investments)
  const allPlans = await planModel.find().lean();

  // Fetch investor investments
  const investments = await investmentModel
    .find({ user: investor._id })
    .populate("plan")
    .lean();

  // Dates for upcoming payments filter
  const today = new Date();
  const next5Days = new Date();
  next5Days.setDate(today.getDate() + 60);

  // If no investments yet
  if (!investments.length) {
    const investedByPlan = allPlans.map((plan) => ({
      plan: plan.planName,
      capital: 0,
    }));

    const emptyDashboard = {
      investorDetails: {
        fullName: investor.name,
        joinDate: investor.createdAt,
        investorId: investor.userId,
        totalInvestments: 0,
        contactDetails: {
          email: investor.email,
          phone: investor.phone,
        },
        status: "Inactive",
      },
      totalInvestmentCapital: 0,
      totalPaidTillDate: 0,
      investedByPlan,
      clearMonths: [],
      comingPayments: [],
    };

    return res
      .status(200)
      .json(new ApiResponse(200, emptyDashboard, "Investor dashboard fetched"));
  }

  // Otherwise, calculate all values
  let totalInvestmentCapital = 0;
  let totalPaidTillDate = 0;
  let investedByPlan = {};
  let clearMonths = [];
  let comingPayments = [];

  for (const inv of investments) {
    totalInvestmentCapital += inv.capital || 0;
    totalPaidTillDate += inv.TotalPaidTillDate || 0;

    const planName = inv.plan?.planName || "Unknown Plan";
    investedByPlan[planName] =
      (investedByPlan[planName] || 0) + (inv.capital || 0);

    if (inv.monthlyReturns && inv.monthlyReturns.length > 0) {
      for (const month of inv.monthlyReturns) {
        const monthData = {
          investmentId: inv.investmentId,
          monthNo: month.monthNo,
          returnDate: month.returnDate,
          paymentStatus: month.status,
          paymentType: month.paymentType || null,
          paymentProof: month.paymentProof || null,
          totalReturn: month.totalReturn || 0,
          planType: inv.plan?.planName || "Unknown",
        };

        if (month.status === "paid") {
          clearMonths.push(monthData);
        } else if (
          month.status === "pending" &&
          new Date(month.returnDate) >= today &&
          new Date(month.returnDate) <= next5Days
        ) {
          comingPayments.push(monthData);
        }
      }
    }
  }

  // Merge all plans into investedByPlan array (even those with 0)
  const investedByPlanArray = allPlans.map((plan) => ({
    plan: plan.planName,
    capital: investedByPlan[plan.planName] || 0,
  }));

  clearMonths.sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
  comingPayments.sort(
    (a, b) => new Date(a.returnDate) - new Date(b.returnDate)
  );

  const hasActiveInvestment = investments.some(
    (inv) => inv.status === "Active"
  );

  const dashboardData = {
    investorDetails: {
      fullName: investor.name,
      joinDate: investor.createdAt,
      investorId: investor.userId,
      totalInvestments: investments.length,
      contactDetails: {
        email: investor.email,
        phone: investor.phone,
      },
      status: hasActiveInvestment ? "Active" : "Inactive",
    },
    totalInvestmentCapital,
    totalPaidTillDate,
    investedByPlan: investedByPlanArray,
    clearMonths,
    comingPayments,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboardData,
        "Investor dashboard fetched successfully"
      )
    );
});
