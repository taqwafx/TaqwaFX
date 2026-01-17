import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TransactionModel } from "../models/Transactions.model.js";

export const getAllTransactions = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 15;
  const fromDate = req.query.fromDate;
  const toDate = req.query.toDate;

  const skip = (page - 1) * limit;

  let filter = {};

  // ✅ Date Range Filter
  if (fromDate && toDate) {
    const startDate = new Date(fromDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(toDate);
    endDate.setHours(23, 59, 59, 999);

    filter.paidAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  // ✅ Transactions (Paginated)
  const transactions = await TransactionModel.find(filter)
    .sort({ paidAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "name")
    .populate("plan", "planName");

  // ✅ Total count
  const total = await TransactionModel.countDocuments(filter);

  // ✅ SUM of paidAMT (FULL RANGE, not page-only)
  const sumResult = await TransactionModel.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        paidAMTSum: { $sum: "$paidAMT" },
      },
    },
  ]);

  const paidAMTSum = sumResult[0]?.paidAMTSum || 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        transactions,
        pagination: {
          total,
          page,
          limit,
          hasMore: skip + transactions.length < total,
        },
        paidAMTSum,
      },
      "Transactions fetched successfully"
    )
  );
});
