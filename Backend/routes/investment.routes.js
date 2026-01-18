import { Router } from "express";
import { createInvestment, getInvestmentDetails, getInvestorInvAcDetails, getInvestorInvestments, markMonthPaid, uploadInvAgreement } from "../controller/investment.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../services/upload.service.js";



const router = Router();

router.route("/create").post(verifyToken, isAdmin, upload.single("agreementFile"), createInvestment);
router.route("/uploadInvAgreement").put(verifyToken, isAdmin, upload.single("agreementFile"), uploadInvAgreement);
router.route("/markmonthpaid/:id").post(verifyToken, isAdmin, markMonthPaid);
router.route("/featch/investment/AcDetails/:userId").get(verifyToken, getInvestorInvAcDetails);

router.route("/featch/investores").get(verifyToken, getInvestorInvestments);
router.route("/featch/investment-details/:id").get(verifyToken, getInvestmentDetails);

export default router;
