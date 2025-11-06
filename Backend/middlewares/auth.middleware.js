import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { userModel } from "../models/user.model.js";

export const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token ||
      (req.headers.authorization && req.headers.authorization.split(" ")[1]);

    if (!token) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Please Relogin"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res
        .status(401)
        .json(new ApiResponse(401, null, "Invalid or expired token"));
    }

    req.user = user; // attach user object to request
    next();
  } catch (error) {
    console.log(error);

    return res
      .status(401)
      .json(new ApiResponse(401, null, "Unauthorized access"));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res
      .status(403)
      .json(new ApiResponse(403, null, "Access denied. Admins only."));
  }
  next();
};
