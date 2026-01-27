import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // auto-generated, e.g. ADM001 or INV001
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "investor"],
    default: "investor",
  },

  // 🔥 AffiliateIB Object
  affiliateIB: {
    isAffiliateIB: { type: Boolean, default: false },
    affiliateIBId: { type: String }, // AIB-TFX5016

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },

    bankDetails: {
      bankName: { type: String },
      bankHolderName: { type: String },
      bankAcNumber: { type: String },
      bankIFSCCode: { type: String },
    },

    createdAt: { type: Date },
  },

  referredBy: {
    referralId: { type: String }, // AIB-TFX4001
    referralCommission: { type: Number }, // 1 / 1.5 / 2
  },

  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

export const userModel = mongoose.model("Users", userSchema);
