import { Schema, model } from "mongoose";

const FAQSchema = new Schema({
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
  },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  is_deleted: {
    type: Boolean,
    default: false,
  },
});

FAQSchema.index({is_deleted: 1});

export const FAQModel = model("FAQ", FAQSchema);
