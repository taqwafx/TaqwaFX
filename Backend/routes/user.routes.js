import { Router } from "express";
import {
  getAllInvestors,
  getInvestorDetails,
  getMe,
  loginUser,
  logoutUser,
  registerInvestor,
  updateInvestorPassword,
} from "../controller/user.controller.js";
import {
  getAdminDashboard,
  getInvestorDashboard,
} from "../controller/dashboard.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(loginUser);
router.route("/me").get(verifyToken, getMe);
router.route("/logout").get(verifyToken, logoutUser);
router.route("/updatePassword").put(verifyToken, updateInvestorPassword);
router.route("/createInvestor").post(verifyToken, isAdmin, registerInvestor);
router.route("/featch/investores").get(verifyToken, isAdmin, getAllInvestors);
router
  .route("/featch/investor-details/:id")
  .get(verifyToken, isAdmin, getInvestorDetails);

router
  .route("/featch/admin/dashboard")
  .get(verifyToken, isAdmin, getAdminDashboard);
router.route("/featch/dashboard/").get(verifyToken, getInvestorDashboard);

export default router;
