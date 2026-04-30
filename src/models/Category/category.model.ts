import mongoose from "mongoose";
import { JOB_CATEGORIES } from "../../utils/constants.js";
import { localizedStringField } from "../../utils/helpers.js";

const categorySchema = new mongoose.Schema(
  {
    name: {
      ...localizedStringField(),
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
        required: false,
        trim: true,
        default: "",
      },
      ar: {
        type: String,
        required: false,
        trim: true,
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

categorySchema
  .path("name.en")
  .validate(
    (value) => JOB_CATEGORIES.includes(value),
    "Category must be one of JOB_CATEGORIES",
  );

export const Category = mongoose.model("Category", categorySchema);
