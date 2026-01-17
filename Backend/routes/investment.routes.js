import { Router } from "express";
import { createInvestment, getInvestmentDetails, getInvestorInvAcDetails, getInvestorInvestments, markMonthPaid } from "../controller/investment.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { uploadAgreement } from "../middlewares/uploadAgreement.js";



const router = Router();

router.route("/create").post(verifyToken, isAdmin, uploadAgreement.single("agreementFile"), createInvestment);
router.route("/markmonthpaid/:id").post(verifyToken, isAdmin, markMonthPaid);
router.route("/featch/investment/AcDetails/:userId").get(verifyToken, getInvestorInvAcDetails);

router.route("/featch/investores").get(verifyToken, getInvestorInvestments);
router.route("/featch/investment-details/:id").get(verifyToken, getInvestmentDetails);

export default router;
