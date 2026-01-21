import { Schema, model } from "mongoose";

const ExperienceLevelSchema = new Schema(
  {
    title: {
      en: {
        type: String,
        required: true,
        trim: true,
      },
      ar: {
        type: String,
        required: true,
        trim: true,
      },
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    minYears: {
      type: Number,
      default: 0,
    },
    maxYears: {
      type: Number,
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ExperienceLevelModel = model(
  "ExperienceLevel",
  ExperienceLevelSchema
);
