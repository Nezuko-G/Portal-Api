import { Schema, model } from "mongoose";
import { localizedStringField } from "../../utils/helpers.js";

const ListItemSchema = new Schema({
  text: { ...localizedStringField() },
});

const JobSchema = new Schema(
  {
    title: { ...localizedStringField() },
    slug: { type: String, required: true },
    jobId: { type: String, unique: true },
    company: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    description: { ...localizedStringField() },
    fieldOfWork: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    experienceLevel: {
      type: Schema.Types.ObjectId,
      ref: "ExperienceLevel",
      required: true,
    },
    keywords: [{ type: Schema.Types.ObjectId, ref: "Keyword" }],
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "internship"],
      default: "full-time",
    },
    employmentType: {
      type: String,
      enum: ["fixed-term", "permanent", "contract"],
    },
    responsibilities: [ListItemSchema],
    requirements: [ListItemSchema],
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    locationDetails: { ...localizedStringField({ required: false }) },
    workMode: {
      type: String,
      enum: ["office", "remote", "hybrid"],
      default: "office",
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    duration: { ...localizedStringField({ required: false }) },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const JobModel = model("Job", JobSchema);
