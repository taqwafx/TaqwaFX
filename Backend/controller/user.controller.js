import { userModel } from "../models/user.model.js";
import { planModel } from "../models/plan.model.js";
import { investmentModel } from "../models/investment.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import mongoose from "mongoose"
import jwt from "jsonwebtoken"


export const getMe = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id).select("-password");
  if (!user) throw new ApiError(404, "Invalid ID");

  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "Login successful!"));
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { userId, password } = req.body;

  if (!userId || !password) {
    throw new ApiError(400, "User ID and Password are required");
  }

  // Check how many users exist
  const existingUsers = await userModel.countDocuments();

  // 🧩 If no users exist => create first Admin
  if (existingUsers === 0) {
    const admin = await userModel.create({
      userId,
      name: "Admin",
      role: "admin",
      password: password,
    });

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user: admin, token },
          "Admin created successfully"
        )
      );
  }

  // 🧩 For normal login (existing users)
  const user = await userModel.findOne({ userId });
  if (!user) throw new ApiError(404, "Invalid ID");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid password");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET_EXPIRY }
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});

export const registerInvestor = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  if (!name || !email || !phone || !password) {
    throw new ApiError(400, "All fields are required");
  }

  // check if email or phone already exists
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, "Investor already exists with this email");
  }

  // count total investors to generate unique ID
  const lastInvestor = await userModel
    .findOne({ role: "investor" })
    .sort({ userId: -1 }) // sort descending
    .limit(1);

  let nextNumber = 5000; // default starting point

  if (lastInvestor && lastInvestor.userId) {
    const lastIdNum = parseInt(lastInvestor.userId.replace("TFX", ""));
    nextNumber = lastIdNum;
  }

  const newInvestorId = `TFX${String(nextNumber + 1)}`;

  const investor = await userModel.create({
    userId: newInvestorId,
    name,
    email,
    phone,
    password,
    role: "investor",
  });

  investor.password = password;

  return res
    .status(201)
    .json(new ApiResponse(201, investor, "Investor Created successfully!"));
});

export const getAllInvestors = asyncHandler(async (req, res) => {
  const {
    search = "",
    status,
    planType,
    repaymentDate,
    roi,
    capitalMin,
    capitalMax,
    page = 1,
    limit = 15,
  } = req.query;

  const pageNum = Math.max(1, parseInt(page) || 1);
  const pageSize = Math.max(1, parseInt(limit) || 15);

  // 1️⃣ Get investors only
  const userFilter = { role: "investor" };
  if (search) {
    userFilter.$or = [
      { name: { $regex: search, $options: "i" } },
      { userId: { $regex: search, $options: "i" } },
    ];
  }

  const users = await userModel
    .find(userFilter)
    .select("name userId createdAt")
    .lean();

  if (!users.length)
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          investors: [],
          pagination: {
            total: 0,
            page: pageNum,
            limit: pageSize,
            totalPages: 0,
          },
        },
        "No investors found"
      )
    );

  const userIds = users.map((u) => u._id);

  // 2️⃣ Get all investments for those investors
  const investments = await investmentModel
    .find({ user: { $in: userIds } })
    .populate("plan", "planName")
    .lean();

  // Group investments per investor
  const invMap = investments.reduce((acc, inv) => {
    const key = String(inv.user);
    if (!acc[key]) acc[key] = [];
    acc[key].push(inv);
    return acc;
  }, {});

  // 3️⃣ Build investor summaries
  const processed = users.map((user) => {
    const userInvs = invMap[String(user._id)] || [];

    const totalCapitalAll = userInvs.reduce(
      (sum, i) => sum + (i.capital || 0),
      0
    );
    const runningInvestments = userInvs.filter(
      (i) => i.status === "Active"
    ).length;

    // Find next repayment date (closest pending)
    let nextRepaymentDate = null;
    const allPending = userInvs.flatMap((i) =>
      (i.monthlyReturns || []).filter(
        (m) => m.status === "pending" && m.returnDate
      )
    );
    if (allPending.length) {
      nextRepaymentDate = new Date(
        Math.min(...allPending.map((m) => new Date(m.returnDate)))
      );
    }

    const hasActiveInvestment = runningInvestments > 0;

    return {
      _userId: user._id,
      investorId: user.userId,
      name: user.name,
      joinDate: user.createdAt,
      investments: userInvs,
      totalCapitalAll,
      nextRepaymentDate,
      hasActiveInvestment,
      runningInvestments,
    };
  });

  // 4️⃣ Apply filters
  const filtered = processed.filter((p) => {
    const invs = p.investments;

    if (status) {
      const matched = invs.some(
        (it) => String(it.status).toLowerCase() === status.toLowerCase()
      );
      if (!matched) return false;
    }

    if (roi) {
      const matched = invs.some((it) => Number(it.roi) === Number(roi));
      if (!matched) return false;
    }

    if (planType) {
      const matched = invs.some(
        (it) =>
          it.plan &&
          String(it.plan.planName).toLowerCase() ===
            String(planType).toLowerCase()
      );
      if (!matched) return false;
    }

    if (repaymentDate) {
      const dnum = Number(repaymentDate);
      const matched = invs.some(
        (it) =>
          Array.isArray(it.monthlyReturns) &&
          it.monthlyReturns.some((m) => {
            if (!m?.returnDate) return false;
            return (
              new Date(m.returnDate).getDate() === dnum &&
              m.status === "pending"
            );
          })
      );
      if (!matched) return false;
    }

    if (capitalMin || capitalMax) {
      const min = capitalMin ? Number(capitalMin) : -Infinity;
      const max = capitalMax ? Number(capitalMax) : Infinity;
      if (!(p.totalCapitalAll >= min && p.totalCapitalAll <= max)) return false;
    }

    return true;
  });

  // 5️⃣ Format response
  const result = filtered.map((p) => ({
    investorId: p.investorId,
    name: p.name,
    joinDate: p.joinDate,
    totalCapital: p.totalCapitalAll,
    nextRepaymentDate: p.nextRepaymentDate,
    hasActiveInvestment: p.hasActiveInvestment,
    runningInvestments: p.runningInvestments,
  }));

  // 6️⃣ Pagination
  const total = result.length;
  const totalPages = Math.ceil(total / pageSize);
  const start = (pageNum - 1) * pageSize;
  const paged = result.slice(start, start + pageSize);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        investors: paged,
        pagination: { total, page: pageNum, limit: pageSize, totalPages },
      },
      "Investors fetched successfully"
    )
  );
});

export const getInvestorDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1️⃣ Validate and find investor by _id or userId
  const query = mongoose.Types.ObjectId.isValid(id)
    ? { _id: id, role: "investor" }
    : { userId: id, role: "investor" };

  const investor = await userModel.findOne(query).lean();
  if (!investor) throw new ApiError(404, "Investor not found");

  // 2️⃣ Fetch all plans & investor investments
  const [allPlans, investments] = await Promise.all([
    planModel.find().lean(),
    investmentModel.find({ user: investor._id }).populate("plan").lean(),
  ]);

  // 3️⃣ Initialize stats
  let totalCapitalInvested = 0;
  let totalPaidTillDate = 0;
  let hasActiveInvestment = false;
  let runningInvestments = 0;
  let nextRepaymentDate = null;

  // 🧮 investment data array
  const investmentData = investments.map((inv) => {
    totalCapitalInvested += inv.capital || 0;
    totalPaidTillDate += inv.TotalPaidTillDate || 0;

    if (inv.status === "Active") {
      hasActiveInvestment = true;
      runningInvestments++;
    }

    // find next repayment date
    const pendingMonths = inv.monthlyReturns?.filter(
      (m) => m.status === "pending"
    );
    if (pendingMonths?.length > 0) {
      const nearestDate = pendingMonths
        .map((m) => new Date(m.returnDate))
        .sort((a, b) => a - b)[0];
      if (!nextRepaymentDate || nearestDate < nextRepaymentDate) {
        nextRepaymentDate = nearestDate;
      }
    }

    const repaymentOn =
      inv.monthlyReturns?.find((m) => m.status === "pending")?.returnDate ||
      null;

    // completed months count
    const completedMonths =
      inv.monthlyReturns?.filter((m) => m.status === "paid").length || 0;

    return {
      investmentId: inv.investmentId,
      capital: inv.capital,
      planType: inv.plan?.planName || "Unknown Plan",
      roi: inv.roi,
      startDate: inv.startDate,
      endDate: inv.endDate,
      repaymentDate: repaymentOn,
      completedMonths,
      status: inv.status,
    };
  });

  // 4️⃣ Calculate total fund per plan
  const investedByPlanMap = {};
  investments.forEach((inv) => {
    const planName = inv.plan?.planName || "Unknown Plan";
    investedByPlanMap[planName] =
      (investedByPlanMap[planName] || 0) + (inv.capital || 0);
  });

  // Ensure all plans exist, even with 0 funds
  allPlans.forEach((plan) => {
    if (!investedByPlanMap[plan.planName]) {
      investedByPlanMap[plan.planName] = 0;
    }
  });

  // Convert to desired array format
  const investedByPlan = Object.entries(investedByPlanMap).map(
    ([planName, totalFund]) => ({
      planName,
      totalFund,
    })
  );

  // Optional: sort by totalFund (highest first)
  investedByPlan.sort((a, b) => b.totalFund - a.totalFund);

  // 5️⃣ Set overall status
  const overallStatus =
    investments.length === 0
      ? "InActive"
      : hasActiveInvestment
      ? "Active"
      : "Completed";

  // 6️⃣ Prepare final response
  const result = {
    investorId: investor.userId,
    name: investor.name,
    joinDate: investor.createdAt,
    runningInvestments,
    contactDetails: {
      email: investor.email,
      phone: investor.phone,
    },
    overallStatus,
    loginDetails: {
      password: investor.password, // ⚠️ in production, don’t send password
    },
    totalCapitalInvested,
    investedByPlan,
    totalPaidTillDate,
    hasActiveInvestment,
    nextRepaymentDate,
    investments: investmentData,
  };

  // ✅ Final response
  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "Investor details fetched successfully")
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .clearCookie("token", options)
    .json(new ApiResponse(200, null, "Logged out successfully"));
});

export const updateInvestorPassword = asyncHandler(async (req, res) => {
  const { investorId, newPassword } = req.body;

  // ✅ Check fields
  if (!investorId || !newPassword) {
    throw new ApiError(400, "Investor ID and new password are required");
  }

  // ✅ Check admin role (optional if route already protected)
  if (req.user.role !== "admin") {
    throw new ApiError(403, "Only admin can update investor password");
  }

  // ✅ Find investor
  const investor = await userModel.findOne({ userId: investorId });
  if (!investor) {
    throw new ApiError(404, "Investor not found");
  }

  // ✅ Update password
  investor.password = newPassword; // your schema should hash it in pre-save hook
  await investor.save();

  // ✅ Send response
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { password: newPassword },
        "Investor password updated successfully"
      )
    );
});