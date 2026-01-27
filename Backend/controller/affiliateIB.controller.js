import { investmentModel } from "../models/investment.model.js";
import { userModel } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyInvestorForAffiliateIB = asyncHandler(async (req, res) => {
  const { investorId } = req.body;

  // 1️⃣ Validate input
  if (!investorId) {
    throw new ApiError(400, "Investor Id is required!");
  }

  // 2️⃣ Check investor exists
  const investor = await userModel.findOne({ userId: investorId });

  if (!investor) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isValid: false },
          "Please Enter valid Investor Id!",
        ),
      );
  }

  // 3️⃣ Ensure role is investor
  if (investor.role !== "investor") {
    res
      .status(200)
      .json(new ApiResponse(200, { isValid: false }, "Something went wrong!"));
  }

  // 4️⃣ Check already AffiliateIB
  if (investor?.affiliateIB?.isAffiliateIB) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isValid: false },
          "This Investor is Already Affiliate Member!",
        ),
      );
  }

  // 5️⃣ Response (send name to frontend)
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isValid: true,
        investorId: investor.userId,
        investorName: investor.name,
      },
      "Investor verified successfully!",
    ),
  );
});

export const createAffiliateIB = asyncHandler(async (req, res) => {
  const { investorId, bankName, bankHolderName, bankAcNumber, bankIFSCCode } =
    req.body;

  // 1️⃣ Validate input
  if (
    !investorId ||
    !bankName ||
    !bankHolderName ||
    !bankAcNumber ||
    !bankIFSCCode
  ) {
    throw new ApiError(400, "All fields are required!");
  }

  // 2️⃣ Find investor
  const investor = await userModel.findOne({ userId: investorId });

  if (!investor) {
    throw new ApiError(400, "Please Enter valid Investor Id!");
  }

  // 3️⃣ Ensure investor role
  if (investor.role !== "investor") {
    throw new ApiError(400, "Something went wrong!");
  }

  // 4️⃣ Prevent duplicate AffiliateIB
  if (investor?.affiliateIB?.isAffiliateIB) {
    throw new ApiError(400, "This User is Already Affiliate Member!");
  }

  // 5️⃣ Create AffiliateIB object (AUTO ADDED TO USER)
  investor.affiliateIB = {
    isAffiliateIB: true,
    affiliateIBId: `AIB-${investor.userId}`,
    status: "active",

    bankDetails: {
      bankName,
      bankHolderName,
      bankAcNumber,
      bankIFSCCode,
    },

    createdAt: new Date(),
  };

  // 6️⃣ Save user
  await investor.save();

  // 7️⃣ Response
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        affiliateIBId: investor.affiliateIB.affiliateIBId,
        investorId: investor.userId,
        investorName: investor.name,
      },
      "AffiliateIB ID created!",
    ),
  );
});

export const verifyAffiliateIB = asyncHandler(async (req, res) => {
  const { referralId } = req.body;

  // 1️⃣ Validate input
  if (!referralId) {
    throw new ApiError(400, "Something went wrong!");
  }

  // 2️⃣ Find AffiliateIB user
  const affiliateUser = await userModel.findOne({
    "affiliateIB.affiliateIBId": referralId,
    "affiliateIB.isAffiliateIB": true,
  });

  if (!affiliateUser) {
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isValid: false },
          "Please Enter valid referral Id!",
        ),
      );
  }

  // 3️⃣ Response (send affiliate name to frontend)
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isValid: true,
        affiliateIBId: affiliateUser.affiliateIB.affiliateIBId,
        affiliateName: affiliateUser.name,
        affiliateUserId: affiliateUser.userId,
      },
      "Referral ID verified successfully!",
    ),
  );
});

export const getAdminAffiliateIBDashboard = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const result = await userModel.aggregate([
    // 🔹 Only AffiliateIB users
    {
      $match: {
        "affiliateIB.isAffiliateIB": true,
      },
    },

    // 🔹 Referred Users
    {
      $lookup: {
        from: "users",
        localField: "affiliateIB.affiliateIBId",
        foreignField: "referredBy.referralId",
        as: "referredUsers",
      },
    },

    // 🔹 Referred Users Investments
    {
      $lookup: {
        from: "investments",
        let: { referredUserIds: "$referredUsers._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$user", "$$referredUserIds"] },
            },
          },
        ],
        as: "referralInvestments",
      },
    },

    // 🔹 Monthly Returns Unwind (for commission date)
    {
      $addFields: {
        upcomingReturns: {
          $filter: {
            input: {
              $reduce: {
                input: "$referralInvestments",
                initialValue: [],
                in: {
                  $concatArrays: ["$$value", "$$this.monthlyReturns"],
                },
              },
            },
            as: "mr",
            cond: {
              $and: [
                { $eq: ["$$mr.status", "pending"] },
                { $gte: ["$$mr.returnDate", today] },
              ],
            },
          },
        },
      },
    },

    // 🔹 Final Projection
    {
      $project: {
        affiliateIBId: "$affiliateIB.affiliateIBId",
        investorId: "$userId",
        name: "$name",

        referralCount: { $size: "$referredUsers" },

        referralFund: {
          $sum: "$referralInvestments.capital",
        },

        nextCommissionDate: {
          $min: "$upcomingReturns.returnDate",
        },

        status: {
          $cond: [
            { $gt: [{ $size: "$referralInvestments" }, 0] },
            "Active",
            "InActive",
          ],
        },
      },
    },
  ]);

  // 🔹 GLOBAL TOTALS
  const totals = await userModel.aggregate([
    {
      $facet: {
        totalAffiliateCount: [
          { $match: { "affiliateIB.isAffiliateIB": true } },
          { $count: "count" },
        ],

        totalReferralUsers: [
          { $match: { "referredBy.referralId": { $exists: true } } },
          { $count: "count" },
        ],

        totalReferralFund: [
          {
            $lookup: {
              from: "investments",
              localField: "_id",
              foreignField: "user",
              as: "inv",
            },
          },
          { $unwind: "$inv" },
          {
            $match: {
              "referredBy.referralId": { $exists: true },
            },
          },
          {
            $group: {
              _id: null,
              totalFund: { $sum: "$inv.capital" },
            },
          },
        ],

        totalReferralInvestments: [
          {
            $lookup: {
              from: "investments",
              localField: "_id",
              foreignField: "user",
              as: "inv",
            },
          },
          { $unwind: "$inv" },
          {
            $match: {
              "referredBy.referralId": { $exists: true },
            },
          },
          { $count: "count" },
        ],
      },
    },
  ]);

  const dashboard = {
    totalAffiliateCount: totals[0].totalAffiliateCount[0]?.count || 0,
    totalReferralUsers: totals[0].totalReferralUsers[0]?.count || 0,
    totalReferralFund: totals[0].totalReferralFund[0]?.totalFund || 0,
    totalReferralInvestments: totals[0].totalReferralInvestments[0]?.count || 0,

    affiliates: result,
  };

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        dashboard,
        "AffiliateIB dashboard fetched successfully",
      ),
    );
});

export const getAffiliateIBDetailById = asyncHandler(async (req, res) => {
  const { affiliateIBId } = req.params;

  if (!affiliateIBId) {
    throw new ApiError(400, "Something went wrong!");
  }

  const data = await userModel.aggregate([
    // 1️⃣ Match AffiliateIB user
    {
      $match: {
        "affiliateIB.affiliateIBId": affiliateIBId,
        "affiliateIB.isAffiliateIB": true,
      },
    },

    // 2️⃣ Referred users
    {
      $lookup: {
        from: "users",
        localField: "affiliateIB.affiliateIBId",
        foreignField: "referredBy.referralId",
        as: "referrals",
      },
    },

    // 3️⃣ Investments of referred users
    {
      $lookup: {
        from: "investments",
        let: { referralUserIds: "$referrals._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$user", "$$referralUserIds"] },
            },
          },
        ],
        as: "investments",
      },
    },

    // 4️⃣ Investment-level stats (atomic)
    {
      $addFields: {
        investmentStats: {
          $map: {
            input: "$investments",
            as: "inv",
            in: {
              userId: "$$inv.user",
              capital: "$$inv.capital",

              paidMonths: {
                $size: {
                  $filter: {
                    input: "$$inv.monthlyReturns",
                    as: "mr",
                    cond: { $eq: ["$$mr.status", "paid"] },
                  },
                },
              },

              isActive: {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$$inv.monthlyReturns",
                        as: "mr",
                        cond: { $eq: ["$$mr.status", "pending"] },
                      },
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },

    // 5️⃣ Attach referral commission %
    {
      $addFields: {
        investmentStats: {
          $map: {
            input: "$investmentStats",
            as: "i",
            in: {
              capital: "$$i.capital",
              paidMonths: "$$i.paidMonths",
              isActive: "$$i.isActive",

              commissionPercent: {
                $arrayElemAt: [
                  {
                    $map: {
                      input: {
                        $filter: {
                          input: "$referrals",
                          as: "r",
                          cond: { $eq: ["$$r._id", "$$i.userId"] },
                        },
                      },
                      as: "ru",
                      in: "$$ru.referredBy.referralCommission",
                    },
                  },
                  0,
                ],
              },
            },
          },
        },
      },
    },

    // 6️⃣ Build referralUsers base
    {
      $addFields: {
        referralUsers: {
          $map: {
            input: "$referrals",
            as: "r",
            in: {
              investorId: "$$r.userId",
              name: "$$r.name",
              joinDate: "$$r.createdAt",
              referralCommission: "$$r.referredBy.referralCommission",

              investments: {
                $filter: {
                  input: "$investments",
                  as: "inv",
                  cond: { $eq: ["$$inv.user", "$$r._id"] },
                },
              },
            },
          },
        },
      },
    },

    // 7️⃣ Enrich referralUsers (FINAL LOGIC)
    {
      $addFields: {
        referralUsers: {
          $map: {
            input: "$referralUsers",
            as: "ru",
            in: {
              investorId: "$$ru.investorId",
              name: "$$ru.name",
              joinDate: "$$ru.joinDate",
              referralCommission: "$$ru.referralCommission",

              totalFund: { $sum: "$$ru.investments.capital" },
              totalInvestments: { $size: "$$ru.investments" },

              nextCommissionDate: {
                $min: {
                  $map: {
                    input: "$$ru.investments",
                    as: "inv",
                    in: {
                      $min: {
                        $map: {
                          input: {
                            $filter: {
                              input: "$$inv.monthlyReturns",
                              as: "mr",
                              cond: { $eq: ["$$mr.status", "pending"] },
                            },
                          },
                          as: "pmr",
                          in: "$$pmr.returnDate",
                        },
                      },
                    },
                  },
                },
              },

              // 🔥 RUNNING MONTHLY EARNING
              runningEarning: {
                $sum: {
                  $map: {
                    input: "$$ru.investments",
                    as: "inv",
                    in: {
                      $cond: [
                        {
                          $gt: [
                            {
                              $size: {
                                $filter: {
                                  input: "$$inv.monthlyReturns",
                                  as: "mr",
                                  cond: {
                                    $eq: ["$$mr.status", "pending"],
                                  },
                                },
                              },
                            },
                            0,
                          ],
                        },
                        {
                          $multiply: [
                            "$$inv.capital",
                            {
                              $divide: ["$$ru.referralCommission", 100],
                            },
                          ],
                        },
                        0,
                      ],
                    },
                  },
                },
              },

              status: {
                $cond: [
                  {
                    $gt: [
                      {
                        $sum: {
                          $map: {
                            input: "$$ru.investments",
                            as: "inv",
                            in: {
                              $size: {
                                $filter: {
                                  input: "$$inv.monthlyReturns",
                                  as: "mr",
                                  cond: {
                                    $eq: ["$$mr.status", "pending"],
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                      0,
                    ],
                  },
                  "Active",
                  "InActive",
                ],
              },
            },
          },
        },
      },
    },

    // 8️⃣ FINAL PROJECTION
    {
      $project: {
        _id: 0,

        affiliate: {
          affiliateIBId: "$affiliateIB.affiliateIBId",
          investorId: "$userId",
          name: "$name",
          joinedAsAffiliateAt: "$affiliateIB.createdAt",
          bankDetails: "$affiliateIB.bankDetails",

          status: {
            $cond: [
              {
                $gt: [
                  {
                    $sum: {
                      $map: {
                        input: "$investmentStats",
                        as: "i",
                        in: { $cond: ["$$i.isActive", 1, 0] },
                      },
                    },
                  },
                  0,
                ],
              },
              "Active",
              "InActive",
            ],
          },
        },

        referralCount: { $size: "$referrals" },

        overallReferralFund: { $sum: "$investments.capital" },

        // 🔥 Affiliate current monthly income
        ibIncome: {
          $sum: {
            $map: {
              input: "$investmentStats",
              as: "i",
              in: {
                $cond: [
                  "$$i.isActive",
                  {
                    $multiply: [
                      "$$i.capital",
                      { $divide: ["$$i.commissionPercent", 100] },
                    ],
                  },
                  0,
                ],
              },
            },
          },
        },

        // 🔥 Affiliate lifetime earning
        totalEarned: {
          $sum: {
            $map: {
              input: "$investmentStats",
              as: "i",
              in: {
                $multiply: [
                  {
                    $multiply: [
                      "$$i.capital",
                      { $divide: ["$$i.commissionPercent", 100] },
                    ],
                  },
                  "$$i.paidMonths",
                ],
              },
            },
          },
        },

        referralUsers: 1,
      },
    },
  ]);

  // 📅 Date range
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const next5Days = new Date();
  next5Days.setDate(today.getDate() + 5);
  next5Days.setHours(23, 59, 59, 999);

  const upcommingRepaymentCommisions = await userModel.aggregate([
    // 1️⃣ Match Affiliate user
    {
      $match: {
        "affiliateIB.affiliateIBId": affiliateIBId,
        "affiliateIB.isAffiliateIB": true,
      },
    },

    // 2️⃣ Get referral users
    {
      $lookup: {
        from: "users",
        localField: "affiliateIB.affiliateIBId",
        foreignField: "referredBy.referralId",
        as: "referrals",
      },
    },

    // 3️⃣ Get investments of referral users
    {
      $lookup: {
        from: "investments",
        let: { referralUserIds: "$referrals._id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$user", "$$referralUserIds"] },
            },
          },
        ],
        as: "investments",
      },
    },

    // 4️⃣ Expand monthlyReturns
    { $unwind: "$investments" },
    {
      $unwind: {
        path: "$investments.monthlyReturns",
        includeArrayIndex: "monthIndex",
      },
    },

    // 5️⃣ Filter next 5 days repayments
    {
      $match: {
        "investments.monthlyReturns.status": "pending",
        "investments.monthlyReturns.returnDate": {
          $gte: today,
          $lte: next5Days,
        },
      },
    },

    // 6️⃣ Attach referral user & plan
    {
      $lookup: {
        from: "users",
        localField: "investments.user",
        foreignField: "_id",
        as: "referralUser",
      },
    },
    { $unwind: "$referralUser" },

    {
      $lookup: {
        from: "plans",
        localField: "investments.plan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },

    // 7️⃣ Final projection
    {
      $project: {
        _id: 0,

        investorId: "$referralUser.userId",
        investorName: "$referralUser.name",

        investmentId: "$investments.investmentId",
        investmentDate: "$investments.createdAt",

        repaymentMonthNumber: {
          $add: ["$monthIndex", 1],
        },

        repaymentDate: "$investments.monthlyReturns.returnDate",

        capital: "$investments.capital",

        planType: "$plan.planName",

        affiliateCommission: {
          $multiply: [
            "$investments.capital",
            {
              $divide: ["$referralUser.referredBy.referralCommission", 100],
            },
          ],
        },
      },
    },

    // 8️⃣ Sort by repayment date
    {
      $sort: {
        repaymentDate: 1,
      },
    },
  ]);

  const paidCommissionHistory = await investmentModel.aggregate([
    // 1️⃣ Join referral users
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "investor",
      },
    },
    { $unwind: "$investor" },

    // 2️⃣ Match only investments referred by this Affiliate
    {
      $match: {
        "investor.referredBy.referralId": affiliateIBId,
      },
    },

    // 3️⃣ Expand monthly returns
    {
      $unwind: "$monthlyReturns",
    },

    // 4️⃣ Only PAID months with referral commission
    {
      $match: {
        "monthlyReturns.status": "paid",
        "monthlyReturns.referrad": { $exists: true },
      },
    },

    // 5️⃣ Join plan
    {
      $lookup: {
        from: "plans",
        localField: "plan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },

    // 6️⃣ Final projection
    {
      $project: {
        _id: 0,

        investmentId: 1,

        investorId: "$investor.userId",
        investorName: "$investor.name",

        monthNo: "$monthlyReturns.monthNo",
        returnDate: "$monthlyReturns.returnDate",

        planType: "$plan.planName",

        commissionAmount: "$monthlyReturns.referrad.totalReturn",

        commissionPaymentType: "$monthlyReturns.referrad.paymentType",

        commissionPaymentProof: "$monthlyReturns.referrad.paymentProof",
      },
    },

    // 7️⃣ Sort latest first
    {
      $sort: {
        returnDate: -1,
      },
    },
  ]);

  if (!data.length) {
    throw new ApiError(404, "AffiliateIB not found");
  }

  const result = {
    ...data[0],
    upcommingCommisions: upcommingRepaymentCommisions || [],
    paidCommissionHistory: paidCommissionHistory || []
  };

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, "AffiliateIB details fetched successfully!"),
    );
});

export const getReferralUserInvestments = asyncHandler(async (req, res) => {
  const { investorId } = req.params;

  if (!investorId) {
    throw new ApiError(400, "Something went wrong!");
  }

  // 1️⃣ Verify referral user belongs to this Affiliate
  const referralUser = await userModel.findOne(
    {
      userId: investorId,
    },
    {
      _id: 1,
      referredBy: 1,
      name: 1,
    },
  );

  if (!referralUser) {
    throw new ApiError(404, "Referral investor not found");
  }

  const referralCommission = referralUser.referredBy.referralCommission;

  // 2️⃣ Get all investments of this referral user
  const investments = await investmentModel.aggregate([
    {
      $match: {
        user: referralUser._id,
      },
    },

    // 🔹 Attach plan
    {
      $lookup: {
        from: "plans",
        localField: "plan",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },

    // 3️⃣ Calculate required fields
    {
      $addFields: {
        completedMonths: {
          $size: {
            $filter: {
              input: "$monthlyReturns",
              as: "mr",
              cond: { $eq: ["$$mr.status", "paid"] },
            },
          },
        },

        upcomingRepaymentDate: {
          $min: {
            $map: {
              input: {
                $filter: {
                  input: "$monthlyReturns",
                  as: "mr",
                  cond: { $eq: ["$$mr.status", "pending"] },
                },
              },
              as: "pmr",
              in: "$$pmr.returnDate",
            },
          },
        },

        endOn: {
          $max: "$monthlyReturns.returnDate",
        },

        isRunning: {
          $gt: [
            {
              $size: {
                $filter: {
                  input: "$monthlyReturns",
                  as: "mr",
                  cond: { $eq: ["$$mr.status", "pending"] },
                },
              },
            },
            0,
          ],
        },
      },
    },

    // 4️⃣ Final projection
    {
      $project: {
        _id: 0,

        investmentId: 1,
        capital: 1,

        planType: "$plan.planName",

        startFrom: "$startDate",
        endOn: "$endDate",

        upcomingRepaymentDate: 1,

        completedMonths: 1,

        // 🔥 commission only if ACTIVE
        commissionProfit: {
          $cond: [
            "$isRunning",
            {
              $multiply: ["$capital", { $divide: [referralCommission, 100] }],
            },
            0,
          ],
        },

        // 🔥 status rename
        status: {
          $cond: ["$isRunning", "Active", "Complete"],
        },
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        investorId,
        investorName: referralUser.name,
        referralCommission,
        investments,
      },
      "Referral investor investments fetched successfully!",
    ),
  );
});

