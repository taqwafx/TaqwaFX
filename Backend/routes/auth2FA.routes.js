import { Router } from "express";
import {
  disable2FA,
  setup2FA,
  verify2FASetup,
  verifyLogin2FA,
} from "../controller/auth2FA.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/setup").get(verifyToken, setup2FA);
router.route("/verify-setup").post(verifyToken, verify2FASetup);
router.route("/disable").post(verifyToken, disable2FA);
router.route("/verify-login").post(verifyLogin2FA);

export default router;
