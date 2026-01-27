import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { createAffiliateIB, getAdminAffiliateIBDashboard, getAffiliateIBDetailById, getReferralUserInvestments, verifyAffiliateIB, verifyInvestorForAffiliateIB } from "../controller/affiliateIB.controller.js";


const router = Router();

router.route("/verifyAffiliateIBID").post(verifyToken, isAdmin, verifyAffiliateIB);
router.route("/verifyInvestorForAffiliateIB").post(verifyToken, isAdmin, verifyInvestorForAffiliateIB);
router.route("/createAffiliateIB").post(verifyToken, isAdmin, createAffiliateIB);
router.route("/admin/dashboard").get(verifyToken, isAdmin, getAdminAffiliateIBDashboard);
router.route("/getAffiliateIBDetailById/:affiliateIBId").get(getAffiliateIBDetailById);
router.route("/getReferralUserInvestments/:investorId").get(getReferralUserInvestments);

export default router;
