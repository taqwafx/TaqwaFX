import { Router } from "express";
import { createPlan, deletePlan, getAllPlans } from "../controller/plan.controller.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";




const router = Router();

router.route("/create").post(verifyToken, isAdmin, createPlan);
router.route("/featch").get(verifyToken, getAllPlans);
router.route("/delete/:planId").delete(verifyToken, deletePlan);

export default router;
