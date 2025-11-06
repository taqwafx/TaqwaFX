import { Router } from "express";
import { createInvestment, getInvestmentDetails, getInvestorInvestments, markMonthPaid } from "../controller/investment.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";



const router = Router();

router.route("/create").post(verifyToken, isAdmin, createInvestment);
router.route("/markmonthpaid/:id").post(verifyToken, isAdmin, markMonthPaid);

router.route("/featch/investores").get(verifyToken, getInvestorInvestments);
router.route("/featch/investment-details/:id").get(verifyToken, getInvestmentDetails);

export default router;
