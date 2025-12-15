import { Schema, model } from "mongoose";

const ListItemSchema = new Schema({
  text: { type: String, trim: true, required: true },
});

const JobSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    jobId: { type: String, unique: true },
    company: { type: String, required: true, trim: true },
    organization: { type: String, trim: true },
    description: { type: String, required: true },
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
    locationDetails: { type: String, trim: true },
    workMode: {
      type: String,
      enum: ["office", "remote", "hybrid"],
      default: "office",
    },
    postedAt: { type: Date, default: Date.now },
    duration: { type: String },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const JobModel = model("Job", JobSchema);
