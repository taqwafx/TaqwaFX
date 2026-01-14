import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { TransactionModel } from "../models/Transactions.model.js";

export const getAllTransactions = asyncHandler(async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const date = req.query.date;

    const skip = (page - 1) * limit;

    let filter = {};

    // ✅ Date filter
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filter.paidAt = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    const transactions = await TransactionModel.find(filter)
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("user", "name")
      .populate("plan", "planName");

    const total = await TransactionModel.countDocuments(filter);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      hasMore: skip + transactions.length < total,
      data: transactions,
    });

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
        },
        "Transaction fetched successfully"
      )
    );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});
