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
      sparse: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      required: false,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
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
    },
    resetPasswordCodeExpires: {
      type: Date,
    },
    resetPasswordCodeVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    avatar: {
      type: String,
      required: false,
    },
    cv: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ is_deleted: 1, is_active: 1 });

const User = mongoose.model("User", userSchema);

export default User;
