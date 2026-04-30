import { Schema, model } from "mongoose";
import { localizedStringField } from "../../utils/helpers.js";

const FAQSchema = new Schema({
  question: {
    ...localizedStringField(),
  },
  answer: {
    ...localizedStringField(),
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

FAQSchema.index({ is_deleted: 1 });

export const Faq = model("Faq", FAQSchema);
