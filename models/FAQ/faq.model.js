import { Schema, model ,mongoose} from "mongoose";

const FAQSchema = new Schema({
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

FAQSchema.index({ is_deleted: 1 });

export const Faq = mongoose.model("Faq", FAQSchema);
