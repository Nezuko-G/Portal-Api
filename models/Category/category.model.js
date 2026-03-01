import mongoose from "mongoose";
import { JOB_CATEGORIES } from "../../utils/constants.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: {
        type: String,
        required: [true, "Category name (English) is required"],
        trim: true,
      },
      ar: {
        type: String,
        required: [true, "Category name (Arabic) is required"],
        trim: true,
      },
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      en: {
        type: String,
        default: "",
      },
      ar: {
        type: String,
        default: "",
      },
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
  { timestamps: true },
);

export const Category = mongoose.model("Category", categorySchema);
