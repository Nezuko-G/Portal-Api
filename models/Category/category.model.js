import mongoose from "mongoose";
import { JOB_CATEGORIES } from "../../utils/constants.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      enum: {
        values: JOB_CATEGORIES,
        message: "Category must be one of JOB_CATEGORIES",
      },
      default: JOB_CATEGORIES[0],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    keywords: {
      type: [String],
      default: [],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
