import { userModel } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import speakeasy from "speakeasy";
import QRCode from "qrcode";
import jwt from "jsonwebtoken";

export const setup2FA = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  const secret = speakeasy.generateSecret({
    length: 20,
    name: `TaqwaFX: ${user.name}`,
  });

  // store temporarily
  user.twoFactorTempSecret = secret.base32;
  await user.save();

  const qrCode = await QRCode.toDataURL(secret.otpauth_url);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { qrCode }, "Scan QR with Google Authenticator"),
    );
});

export const verify2FASetup = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const user = await userModel.findById(req.user._id);

  if (!user || !user.twoFactorTempSecret)
    throw new ApiError(400, "Something went wrong!");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorTempSecret,
    encoding: "base32",
    token: otp,
    window: 1,
  });

  if (!verified) throw new ApiError(401, "Invalid OTP");

  user.twoFactorSecret = user.twoFactorTempSecret;
  user.twoFactorTempSecret = undefined;
  user.twoFactorEnabled = true;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "2FA enabled successfully"));
});

export const disable2FA = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const user = await userModel.findById(req.user._id);

  if (!user) throw new ApiError(404, "User not found");

  if (!user.twoFactorEnabled || !user.twoFactorSecret) {
    throw new ApiError(400, "Something went wrong!");
  }

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: otp,
    window: 1,
  });

  if (!verified) throw new ApiError(400, "Invalid OTP");

  user.twoFactorEnabled = false;
  user.twoFactorSecret = undefined;

  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "2FA disabled successfully"));
});

export const verifyLogin2FA = asyncHandler(async (req, res) => {
  const { otp, tempToken } = req.body;

  if (!tempToken) throw new ApiError(400, "Temporary token missing");

  const decoded = jwt.verify(tempToken, process.env.JWT_SECRET);

  const user = await userModel.findById(decoded.id);

  if (!user) throw new ApiError(404, "User not found");

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token: otp,
    window: 1,
  });

  if (!verified) throw new ApiError(401, "Invalid OTP");

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_SECRET_EXPIRY },
  );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  return res
    .status(200)
    .cookie("token", token, options)
    .json(new ApiResponse(200, { user, token }, "Login successful"));
});
