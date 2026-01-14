import { Router } from "express";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import { getAllTransactions } from "../controller/transaction.controller.js";

const router = Router();

router.route("/featch").get(verifyToken, isAdmin, getAllTransactions);

export default router;
