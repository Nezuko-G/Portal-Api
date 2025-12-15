import { Schema, model } from "mongoose";

const KeywordSchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
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

export const KeywordModel = model("Keyword", KeywordSchema);
