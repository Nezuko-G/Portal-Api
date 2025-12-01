import mongoose from "mongoose";
import { ROLES, DEFAULT_ROLE } from "../../utils/constants.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    password: {
      type: String,
      required: false, // Not required for OAuth users
    },
    role: {
      type: String,
      enum: [...ROLES],
      default: DEFAULT_ROLE,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
    resetPasswordCode: {
      type: String,
      select: false,
    },
    resetPasswordCodeExpires: {
      type: Date,
      select: false,
    },
    resetPasswordCodeVerified: {
      type: Boolean,
      default: false,
      select: false,
    },
    // OAuth provider fields
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but unique non-null values
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values but unique non-null values
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ is_deleted: 1, is_active: 1 });
// Compound indexes for OAuth users
userSchema.index({ provider: 1, googleId: 1 }, { sparse: true });
userSchema.index({ provider: 1, githubId: 1 }, { sparse: true });

const User = mongoose.model("User", userSchema);

export default User;
