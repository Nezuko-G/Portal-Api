import mongoose from "mongoose";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import { localizedStringField } from "../../utils/helpers.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      ...localizedStringField(),
      validate: {
        validator: (value) =>
          Boolean(value?.en) && JOB_CATEGORIES.includes(value.en),
        message: "Category must be one of JOB_CATEGORIES",
      },
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      ...localizedStringField({ required: false }),
      default: { en: "", ar: "" },
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
