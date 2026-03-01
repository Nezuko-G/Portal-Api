import { Schema, model } from "mongoose";

const ListItemSchema = new Schema({
  text: { type: String, trim: true, required: true },
});

const JobSchema = new Schema(
  {
    title: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    slug: { type: String, required: true },
    jobId: { type: String, unique: true },
    company: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    organization: {
      en: { type: String, trim: true },
      ar: { type: String, trim: true },
    },
    description: {
      en: { type: String, required: true },
      ar: { type: String, required: true },
    },
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
    responsibilities: {
      en: [ListItemSchema],
      ar: [ListItemSchema],
    },
    requirements: {
      en: [ListItemSchema],
      ar: [ListItemSchema],
    },
    country: { type: Schema.Types.ObjectId, ref: "Country", required: true },
    locationDetails: { type: String, trim: true },
    workMode: {
      type: String,
      enum: ["office", "remote", "hybrid"],
      default: "office",
    },
    expirationDate: {
      type: Date,
      required: true,
    },
    duration: { type: String },
    is_deleted: { type: Boolean, default: false },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const JobModel = model("Job", JobSchema);
