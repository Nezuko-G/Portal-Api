import { Schema, model } from "mongoose";

const ExperienceLevelSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true, // junior, mid, senior
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
