import { Schema, model } from "mongoose";

const ContactUsSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
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

ContactUsSchema.index({ is_deleted: 1 });

export const ContactUsModel = model("ContactUs", ContactUsSchema);
